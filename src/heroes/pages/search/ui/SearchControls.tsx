import { useRef, type KeyboardEvent } from "react";
import { useSearchParams } from "react-router";
import { Search, Filter, SortAsc, Grid, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";

export const SearchControls = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeAccordion = searchParams.get("active-accordion") ?? "";
  const selectedStrength = Number(searchParams.get("strength") ?? "0");

  const setQueryParams = (name: string, value: string) => {
    setSearchParams((previous) => {
      previous.set(name, value);
      return previous;
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const name = inputRef.current?.value ?? "";

      setQueryParams("name", name);
      // setSearchParams((previous) => {
      //   previous.set("name", name);
      //   return previous;
      // });
    }
  };

  const handleFilterClick = () => {
    setQueryParams(
      "active-accordion",
      activeAccordion ? "" : "advanced-filters",
    );
  };

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            ref={inputRef}
            placeholder="Buscar héroes, villanos, poderes, equipos..."
            className="pl-12 h-12 text-lg bg-white"
            onKeyDown={handleKeyDown}
            defaultValue={searchParams.get("name") ?? ""}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant={activeAccordion ? "default" : "outline"}
            className="h-12"
            onClick={handleFilterClick}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>

          <Button variant="outline" className="h-12">
            <SortAsc className="h-4 w-4 mr-2" />
            Orderar por Nombre
          </Button>

          <Button variant="outline" className="h-12">
            <Grid className="h-4 w-4" />
          </Button>

          <Button className="h-12">
            <Plus className="h-4 w-4 mr-2" />
            Añadir Personaje
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <Accordion
        type="single"
        collapsible
        value={activeAccordion ? "advanced-filters" : ""}
        data-testid="accordion"
      >
        <AccordionItem value="advanced-filters">
          {/* <AccordionTrigger>Filtros avanzados</AccordionTrigger> */}
          <AccordionContent>
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
                <Button variant="ghost">Borrar Todos</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Equipo</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    Todos los equipos
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    Todas las categorías
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Universo</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    Todos los universos
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    Todos los estados
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">
                  Fuerza mínima: {selectedStrength}/10
                </label>
                <Slider
                  defaultValue={[selectedStrength]}
                  onValueChange={(value) =>
                    setQueryParams("strength", value[0].toString())
                  }
                  max={10}
                  step={1}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};
