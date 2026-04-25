import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";
import { HeroGrid } from "@/heroes/components/HeroGrid";

import { SearchHeroesAction } from "@/heroes/actions/search-heroes.action";

export const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const name = searchParams.get("name") ?? undefined;
  const strength = searchParams.get("strength") ?? undefined;

  const { data: heroes = [] } = useQuery({
    queryKey: ["search", { name, strength }],
    queryFn: () => SearchHeroesAction({ name, strength }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <CustomJumbotron
        title="Búsqueda de Super Héroes"
        description="Descubre, explora y administra super héroes y  villanos"
      />
      <CustomBreadcrumbs
        routes={[
          { to: "/", label: "Home" },
          { to: "/search", label: "Búsqueda de superhéroes" },
        ]}
      />
      {/* Stats Dashboard */}
      <HeroStats />
      {/* Filter and search */}
      <SearchControls />
      <HeroGrid heroes={heroes} />
    </>
  );
};

export default SearchPage;
