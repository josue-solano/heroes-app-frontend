import { use } from "react";
import { Heart, Trophy, Users, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { HeroStatCard } from "./HeroStatCard";
import { useHeroSummary } from "../hooks/useHeroSummary";
import { FavoriteHeroContext } from "../context/FavoriteHeroContext";

export const HeroStats = () => {
  const { data: summaryResponse } = useHeroSummary();

  const { favoriteCount } = use(FavoriteHeroContext);

  if (!summaryResponse) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <HeroStatCard
        title="Total de personajes"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">{summaryResponse?.totalHeroes}</div>
        <div className="flex gap-1 mt-2">
          <Badge variant="secondary" className="text-xs">
            {summaryResponse?.heroCount} Héroes
          </Badge>
          <Badge variant="destructive" className="text-xs">
            {summaryResponse?.villainCount} Villanos
          </Badge>
        </div>
      </HeroStatCard>

      <HeroStatCard
        title="Favoritos"
        icon={<Heart className="h-4 w-4 text-muted-foreground" />}
      >
        {/* TODO: tenemos que calcular este valor */}
        <div
          className="text-2xl font-bold text-red-600"
          data-testid="favorite-count"
        >
          {favoriteCount}
        </div>
        <p
          className="text-xs text-muted-foreground"
          data-testid="favorite-percentage"
        >
          {((favoriteCount / summaryResponse.totalHeroes) * 100).toFixed(2)}%
          del total
        </p>
      </HeroStatCard>

      <HeroStatCard
        title="Fuerte"
        icon={<Zap className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">
          {summaryResponse?.strongestHero.alias}
        </div>
        <p className="text-xs text-muted-foreground">
          Fuerza: {`${summaryResponse?.strongestHero.strength}/10`}
        </p>
      </HeroStatCard>

      <HeroStatCard
        title="Inteligente"
        icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-lg font-bold">
          {summaryResponse?.smartestHero.alias}
        </div>
        <p className="text-xs text-muted-foreground">
          Inteligencia: {`${summaryResponse?.smartestHero.intelligence}/10`}
        </p>
      </HeroStatCard>
    </div>
  );
};
