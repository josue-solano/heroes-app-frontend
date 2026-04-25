import type { Hero } from "../types/hero.interface";
import { HeroGridCard } from "./HeroGridCard";

interface Props {
  heroes: Array<Hero>;
}

export const HeroGrid = ({ heroes }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {heroes?.map((heroe) => (
        <HeroGridCard key={heroe.id} hero={heroe} />
      ))}
    </div>
  );
};
