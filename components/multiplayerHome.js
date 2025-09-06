import { useEffect, useState } from "react"
// import BannerText from "./bannerText"; // Removed
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import PlayerList from "./playerList";
import { useTranslation } from '@/components/useTranslations'
import MapsModal from "./maps/mapsModal";
import PartyModal from "./partyModal";


export default function MultiplayerHome({ ws, setWs, multiplayerError, multiplayerState, setMultiplayerState, session, handleAction, partyModalShown, setPartyModalShown, selectCountryModalShown, setSelectCountryModalShown }) {

    const { t: text } = useTranslation("common");

    // Remove local state since it's now passed from parent
    // const [selectCountryModalShown, setSelectCountryModalShown] = useState(false);
    const [gameOptions, setGameOptions] = useState({
        showRoadName: true, // rate limit fix: showRoadName true
        nm: false,
        npz: false
    });


    useEffect(() => {
        setMultiplayerState((prev) => ({ ...prev, createOptions: { ...prev.createOptions, ...gameOptions } }));
    }, [gameOptions]);

    if (multiplayerError) {
        return (
            <div className="multiplayerHome">
                <div className="text-center p-lg bg-red-100 text-red-800 rounded">
                    {text("connectionLost")}
                </div>
            </div>
        )
    }

    if (!((multiplayerState?.inGame) || (multiplayerState?.enteringGameCode) ||

        (multiplayerState?.gameQueued) || (multiplayerState?.nextGameQueued))) {
        return (
            <div className="multiplayerHome">
                <div className="text-center p-lg bg-red-100 text-red-800 rounded">
                    {text("connectionLost")}
                </div>
            </div>
        )
    }

    return (
        <div className={`multiplayerHome g2_slide_in ${!["waiting"].includes(multiplayerState?.gameData?.state) ? "inGame" : ""}`}>
            {/* <BannerText text={multiplayerState.error} shown={multiplayerState.error} hideCompass={true} /> */}

            {multiplayerState.connected && !multiplayerState.inGame && !multiplayerState.gameQueued && multiplayerState.enteringGameCode && (
                <div className="join-party-container">
                    <div className="join-party-card">
                        <h2 className="join-party-title">{text("joinGame")}</h2>

                        <div className="join-party-form">
                            <div className="join-party-input-group">
                                <input
                                    type="text"
                                    className="join-party-input"
                                    placeholder={text("gameCode")}
                                    value={multiplayerState.joinOptions.gameCode || ""}
                                    maxLength={6}
                                    onChange={(e) => setMultiplayerState((prev) => ({
                                        ...prev,
                                        joinOptions: {
                                            ...prev.joinOptions,
                                            gameCode: e.target.value.replace(/\D/g, "")
                                        }
                                    }))}
                                />
                                <button
                                    className="join-party-button"
                                    disabled={multiplayerState?.joinOptions?.gameCode?.length !== 6 || multiplayerState?.joinOptions?.progress}
                                    onClick={() => handleAction("joinPrivateGame", multiplayerState?.joinOptions?.gameCode)}
                                >
                                    {multiplayerState?.joinOptions?.progress ? "..." : text("go")}
                                </button>
                            </div>

                            {multiplayerState?.joinOptions?.error && (
                                <div className="join-party-error">
                                    {multiplayerState.joinOptions.error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {multiplayerState.gameQueued && (
                <div className="text-center p-lg bg-blue-100 text-blue-800 rounded">
                    {text("findingGame")}
                    {multiplayerState?.publicDuelRange && (
                        <div className="text-sm mt-sm">
                            {text("eloRange")}: {multiplayerState?.publicDuelRange[0]} - {multiplayerState?.publicDuelRange[1]}
                        </div>
                    )}
                </div>
            )}

            {multiplayerState.inGame && multiplayerState.gameData?.state === "waiting" && multiplayerState.gameData?.public && (
                <div className="text-center p-lg bg-yellow-100 text-yellow-800 rounded">
                    {text("waiting")}...
                </div>
            )}

            {multiplayerState.inGame && multiplayerState.gameData?.state === "waiting" && !multiplayerState.gameData?.public && (
                <PlayerList multiplayerState={multiplayerState} startGameHost={() => handleAction("startGameHost")} onEditClick={() => setPartyModalShown(true)} />
            )}

            <PartyModal selectCountryModalShown={selectCountryModalShown} setSelectCountryModalShown={setSelectCountryModalShown} ws={ws} setWs={setWs} multiplayerError={multiplayerError} multiplayerState={multiplayerState} setMultiplayerState={setMultiplayerState} session={session} handleAction={handleAction} gameOptions={gameOptions} setGameOptions={setGameOptions} onClose={() => setPartyModalShown(false)} shown={partyModalShown} />


        </div>
    )
}