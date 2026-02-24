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
}

const matchTypeShort: Record<TeamEventMatchType, string> = {
  [TeamEventMatchType.singles1]: "SINGLES 1",
  [TeamEventMatchType.singles2]: "SINGLES 2",
  [TeamEventMatchType.doubles]: "DOBLES",
};

function getShortName(player: TeamEventPlayer): string {
  return player.player.lastname;
}

function getPlayerInitials(player: TeamEventPlayer): string {
  const first = player.player.name.charAt(0).toUpperCase();
  const last = player.player.lastname.charAt(0).toUpperCase();
  return `${first}${last}`;
}

function transformCloudinaryUrl(url: string): string {
  if (!url.includes("cloudinary.com")) return url;
  return url
    .replace(/\/upload\/.*?\//, "/upload/w_160,h_160,c_fill,g_face,f_png/")
    .replace(/\.\w+$/, ".png");
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
        src={transformCloudinaryUrl(photo)}
        alt={getShortName(player)}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid rgba(255,255,255,0.3)",
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
        backgroundColor: "#4D5442",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid rgba(255,255,255,0.3)",
        fontSize: size * 0.35,
        fontWeight: 700,
        color: "#F3DF96",
        fontFamily: "system-ui, -apple-system, sans-serif",
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

  const avatarSize = isDoubles ? 60 : 80;

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Match type label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          padding: "0 20px",
        }}
      >
        <div
          style={{
            flex: 1,
            height: 1,
            background: "rgba(255,255,255,0.15)",
          }}
        />
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#F3DF96",
            letterSpacing: 2,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {matchTypeShort[match.matchType]}
        </span>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "rgba(255,255,255,0.15)",
          }}
        />
      </div>

      {/* Match card */}
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 16,
          padding: "20px 24px",
          margin: "0 24px",
        }}
      >
        {/* Players row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Home side */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <PlayerAvatar player={match.homePlayer1} size={avatarSize} />
              {isDoubles && match.homePlayer2 && (
                <div style={{ marginLeft: -12 }}>
                  <PlayerAvatar player={match.homePlayer2} size={avatarSize} />
                </div>
              )}
            </div>
            <span
              style={{
                fontSize: isDoubles ? 22 : 26,
                fontWeight: homeWon ? 700 : 500,
                color: homeWon ? "#F3DF96" : "#FFFFFF",
                fontFamily: "system-ui, -apple-system, sans-serif",
                wordBreak: "break-word",
              }}
            >
              {homeName}
            </span>
          </div>

          {/* Score */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 120,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: homeWon ? "#F3DF96" : "rgba(255,255,255,0.6)",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {match.homeGames}
              </span>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                -
              </span>
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: awayWon ? "#F3DF96" : "rgba(255,255,255,0.6)",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {match.awayGames}
              </span>
            </div>
            {match.hasTiebreak && (
              <span
                style={{
                  fontSize: 20,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                ({match.homeTiebreakScore}-{match.awayTiebreakScore})
              </span>
            )}
          </div>

          {/* Away side */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                fontSize: isDoubles ? 22 : 26,
                fontWeight: awayWon ? 700 : 500,
                color: awayWon ? "#F3DF96" : "#FFFFFF",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textAlign: "right",
                wordBreak: "break-word",
              }}
            >
              {awayName}
            </span>
            <div style={{ display: "flex", alignItems: "center" }}>
              {isDoubles && match.awayPlayer2 && (
                <PlayerAvatar player={match.awayPlayer2} size={avatarSize} />
              )}
              <div style={{ marginLeft: isDoubles && match.awayPlayer2 ? -12 : 0 }}>
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
  function MatchStoryCard({ series }, ref) {
    const homeName = series.homeTeam?.name ?? "Local";
    const awayName = series.awayTeam?.name ?? "Visitante";
    const winnerName = series.winner?.name;
    const isFinal = series.phase === TeamEventSeriesPhase.final;

    const phaseLabel = isFinal
      ? "FINAL"
      : `Jornada ${series.matchday}${series.roundNumber > 1 ? " (Vuelta)" : " (Ida)"}`;

    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1920,
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "system-ui, -apple-system, sans-serif",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "48px 40px 24px",
          }}
        >
          <img
            crossOrigin="anonymous"
            src="/LOGOTENIS.png"
            alt="Mi Ranking Tenis"
            style={{ width: 64, height: 64, objectFit: "contain" }}
          />
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: 1,
              }}
            >
              MI RANKING TENIS
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: 3,
              }}
            >
              TORNEO POR EQUIPOS
            </div>
          </div>
        </div>

        {/* Phase badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "8px 0 32px",
          }}
        >
          <div
            style={{
              background: isFinal
                ? "linear-gradient(135deg, #F3DF96 0%, #c9a730 100%)"
                : "rgba(255,255,255,0.12)",
              color: isFinal ? "#1a1a2e" : "#FFFFFF",
              padding: "8px 32px",
              borderRadius: 24,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {phaseLabel}
          </div>
        </div>

        {/* Teams & Series Score */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 40px 16px",
          }}
        >
          {/* Team names */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 34,
                fontWeight: 800,
                color:
                  series.winnerId === series.homeTeamId
                    ? "#F3DF96"
                    : "#FFFFFF",
                textAlign: "center",
                flex: 1,
                textTransform: "uppercase",
              }}
            >
              {homeName}
            </span>
            <span
              style={{
                fontSize: 34,
                fontWeight: 800,
                color:
                  series.winnerId === series.awayTeamId
                    ? "#F3DF96"
                    : "#FFFFFF",
                textAlign: "center",
                flex: 1,
                textTransform: "uppercase",
              }}
            >
              {awayName}
            </span>
          </div>

          {/* Big score */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 96,
                fontWeight: 900,
                color:
                  series.winnerId === series.homeTeamId
                    ? "#F3DF96"
                    : "rgba(255,255,255,0.7)",
                lineHeight: 1,
              }}
            >
              {series.homeMatchesWon}
            </span>
            <span
              style={{
                fontSize: 64,
                fontWeight: 300,
                color: "rgba(255,255,255,0.3)",
                lineHeight: 1,
              }}
            >
              -
            </span>
            <span
              style={{
                fontSize: 96,
                fontWeight: 900,
                color:
                  series.winnerId === series.awayTeamId
                    ? "#F3DF96"
                    : "rgba(255,255,255,0.7)",
                lineHeight: 1,
              }}
            >
              {series.awayMatchesWon}
            </span>
          </div>

          {/* Winner indicator */}
          {winnerName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 24, color: "#F3DF96" }}>&#9733;</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "#F3DF96",
                }}
              >
                Ganador: {winnerName}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.2) 80%, transparent 100%)",
            margin: "8px 40px 24px",
          }}
        />

        {/* Matches */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {series.matches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "32px 0 48px",
          }}
        >
          <span
            style={{
              fontSize: 22,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 2,
              fontWeight: 500,
            }}
          >
            mirankingtenis.com.ar
          </span>
        </div>
      </div>
    );
  }
);
