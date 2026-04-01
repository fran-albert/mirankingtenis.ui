"use client";
import { forwardRef } from "react";
import {
  TeamEventSeries,
  TeamEventMatch,
  TeamEventPlayer,
} from "@/types/Team-Event/TeamEvent";
import {
  TeamEventSeriesPhase,
  TeamEventMatchType,
  TeamEventMatchSide,
} from "@/common/enum/team-event.enum";

interface MatchStoryCardProps {
  series: TeamEventSeries;
  eventName?: string;
  eventDescription?: string | null;
  categoryName?: string;
}

const headingFont = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';
const bodyFont = '"Trebuchet MS", "Segoe UI", sans-serif';

const matchTypeShort: Record<TeamEventMatchType, string> = {
  [TeamEventMatchType.singles1]: "SINGLES 1",
  [TeamEventMatchType.singles2]: "SINGLES 2",
  [TeamEventMatchType.doubles]: "DOBLES",
};

function getShortName(player: TeamEventPlayer): string {
  return player.player.lastname.toUpperCase();
}

function getPlayerInitials(player: TeamEventPlayer): string {
  const first = player.player.name.charAt(0).toUpperCase();
  const last = player.player.lastname.charAt(0).toUpperCase();
  return `${first}${last}`;
}

function transformCloudinaryUrl(url: string, width: number, height: number): string {
  if (!url.includes("cloudinary.com")) return url;
  return url
    .replace(
      /\/upload\/.*?\//,
      `/upload/w_${width},h_${height},c_fill,g_face,f_png,q_auto:good/`
    )
    .replace(/\.\w+$/, ".png");
}

function getStoryDescription(
  eventDescription: string | null | undefined,
  categoryName: string | undefined,
  phaseLabel: string
): string {
  const cleanedDescription = eventDescription?.trim();
  if (cleanedDescription) return cleanedDescription;
  if (categoryName?.trim()) return `${categoryName} - ${phaseLabel}`;
  return phaseLabel;
}

function PlayerAvatar({
  player,
  size,
}: {
  player: TeamEventPlayer;
  size: number;
}) {
  const photo = player.player.photo;
  if (photo) {
    return (
      <img
        crossOrigin="anonymous"
        src={transformCloudinaryUrl(photo, size * 2, size * 2)}
        alt={getShortName(player)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid rgba(255,255,255,0.35)",
          boxShadow: "0 8px 18px rgba(0,0,0,0.45)",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "linear-gradient(145deg, rgba(71,79,58,1) 0%, rgba(49,54,41,1) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "3px solid rgba(255,255,255,0.35)",
        fontSize: size * 0.34,
        fontWeight: 800,
        color: "#F8E18A",
        fontFamily: headingFont,
      }}
    >
      {getPlayerInitials(player)}
    </div>
  );
}

function MatchRow({ match }: { match: TeamEventMatch }) {
  const isDoubles = match.matchType === TeamEventMatchType.doubles;
  const homeWon = match.winningSide === TeamEventMatchSide.home;
  const awayWon = match.winningSide === TeamEventMatchSide.away;

  const home1 = getShortName(match.homePlayer1);
  const away1 = getShortName(match.awayPlayer1);
  const home2 =
    isDoubles && match.homePlayer2 ? getShortName(match.homePlayer2) : null;
  const away2 =
    isDoubles && match.awayPlayer2 ? getShortName(match.awayPlayer2) : null;

  const homeName = home2 ? `${home1}/${home2}` : home1;
  const awayName = away2 ? `${away1}/${away2}` : away1;
  const avatarSize = 80;

  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
          padding: "0 16px",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.16)" }} />
        <span
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#F8E18A",
            letterSpacing: 1.6,
            fontFamily: headingFont,
          }}
        >
          {matchTypeShort[match.matchType]}
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.16)" }} />
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 16,
          minHeight: 130,
          padding: "14px 18px",
          margin: "0 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <PlayerAvatar player={match.homePlayer1} size={avatarSize} />
              {isDoubles && match.homePlayer2 && (
                <div style={{ marginLeft: -16 }}>
                  <PlayerAvatar player={match.homePlayer2} size={avatarSize} />
                </div>
              )}
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: homeWon ? 900 : 600,
                color: homeWon ? "#F8E18A" : "#FFFFFF",
                fontFamily: headingFont,
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {homeName}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 170,
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: homeWon ? "#F8E18A" : "rgba(255,255,255,0.72)",
                fontFamily: headingFont,
                lineHeight: 0.9,
              }}
            >
              {match.homeGames}
            </span>
            <span
              style={{
                fontSize: 36,
                color: "rgba(255,255,255,0.4)",
                fontFamily: headingFont,
              }}
            >
              -
            </span>
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: awayWon ? "#F8E18A" : "rgba(255,255,255,0.72)",
                fontFamily: headingFont,
                lineHeight: 0.9,
              }}
            >
              {match.awayGames}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: awayWon ? 900 : 600,
                color: awayWon ? "#F8E18A" : "#FFFFFF",
                fontFamily: headingFont,
                letterSpacing: 0.5,
                textAlign: "right",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {awayName}
            </span>
            <div style={{ display: "flex", alignItems: "center" }}>
              {isDoubles && match.awayPlayer2 && (
                <PlayerAvatar player={match.awayPlayer2} size={avatarSize} />
              )}
              <div style={{ marginLeft: isDoubles && match.awayPlayer2 ? -16 : 0 }}>
                <PlayerAvatar player={match.awayPlayer1} size={avatarSize} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const MatchStoryCard = forwardRef<HTMLDivElement, MatchStoryCardProps>(
  function MatchStoryCard(
    { series, eventName, eventDescription, categoryName },
    ref
  ) {
    const homeName = series.homeTeam?.name ?? "Local";
    const awayName = series.awayTeam?.name ?? "Visitante";
    const winnerName = series.winner?.name;
    const isFinal = series.phase === TeamEventSeriesPhase.final;
    const phaseLabel = isFinal
      ? "PLAYOFF"
      : `JORNADA ${series.matchday}${series.roundNumber > 1 ? " - VUELTA" : " - IDA"}`;
    const title = eventName?.trim() || "TORNEO POR EQUIPOS";
    const description = getStoryDescription(
      eventDescription,
      categoryName,
      phaseLabel
    );

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1920,
          background:
            "radial-gradient(circle at 50% -8%, rgba(142,162,255,0.35), transparent 52%), linear-gradient(180deg, #081024 0%, #0B1734 45%, #121E43 100%)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -200,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(248,225,138,0.1)",
            filter: "blur(0.5px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 220,
            left: -160,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(85,128,255,0.16)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: "40px 44px 18px",
            zIndex: 2,
          }}
        >
          <img
            crossOrigin="anonymous"
            src="/LOGOTENIS.png"
            alt="Mi Ranking Tenis"
            style={{
              width: 126,
              height: 126,
              objectFit: "contain",
              filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))",
            }}
          />
          <div style={{ maxWidth: 760 }}>
            <div
              style={{
                fontSize: 76,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 1.1,
                lineHeight: 0.92,
                textTransform: "uppercase",
                fontFamily: headingFont,
                textShadow: "0 8px 18px rgba(0,0,0,0.45)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 30,
                fontWeight: 700,
                color: "rgba(255,255,255,0.84)",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                fontFamily: bodyFont,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 14,
            zIndex: 2,
          }}
        >
          <div
            style={{
              background: isFinal
                ? "linear-gradient(135deg, #F8E18A 0%, #CAA532 100%)"
                : "rgba(255,255,255,0.16)",
              color: isFinal ? "#121A38" : "#FFFFFF",
              borderRadius: 999,
              padding: "10px 28px",
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              fontFamily: headingFont,
            }}
          >
            {phaseLabel}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px 40px 8px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 40,
                fontWeight: 900,
                color:
                  series.winnerId === series.homeTeamId ? "#F8E18A" : "#FFFFFF",
                textTransform: "uppercase",
                fontFamily: headingFont,
                maxWidth: 390,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {homeName}
            </span>
            <span
              style={{
                fontSize: 40,
                fontWeight: 900,
                color:
                  series.winnerId === series.awayTeamId ? "#F8E18A" : "#FFFFFF",
                textTransform: "uppercase",
                fontFamily: headingFont,
                textAlign: "right",
                maxWidth: 390,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {awayName}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 118,
                fontWeight: 900,
                lineHeight: 0.9,
                color:
                  series.winnerId === series.homeTeamId
                    ? "#F8E18A"
                    : "rgba(255,255,255,0.75)",
                fontFamily: headingFont,
              }}
            >
              {series.homeMatchesWon}
            </span>
            <span
              style={{
                fontSize: 58,
                color: "rgba(255,255,255,0.4)",
                fontFamily: headingFont,
              }}
            >
              -
            </span>
            <span
              style={{
                fontSize: 118,
                fontWeight: 900,
                lineHeight: 0.9,
                color:
                  series.winnerId === series.awayTeamId
                    ? "#F8E18A"
                    : "rgba(255,255,255,0.75)",
                fontFamily: headingFont,
              }}
            >
              {series.awayMatchesWon}
            </span>
          </div>

          {winnerName && (
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: "#F8E18A",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                fontFamily: headingFont,
              }}
            >
              GANADOR: {winnerName}
            </div>
          )}
        </div>

        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.32) 18%, rgba(255,255,255,0.32) 82%, transparent 100%)",
            margin: "8px 34px 10px",
          }}
        />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingBottom: 8,
            zIndex: 2,
          }}
        >
          {series.matches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "18px 0 24px",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 1.6,
              fontWeight: 700,
              fontFamily: bodyFont,
            }}
          >
            MIRANKINGTENIS.COM.AR
          </span>
        </div>
      </div>
    );
  }
);
