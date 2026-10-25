import { Icon } from "@/components/icon";
import { Button } from "@/components/button";
import { AnimatedDisclosure } from "@/components/animated-disclosure";
import { FormattedAmountInput } from "@/components/formatted-amount-input";
import { propertySubtypes } from "@/lib/property-subtypes";

type SearchValues = {
  operation?: string;
  location?: string;
  type?: string;
  subtype?: string;
  rooms?: string;
  currency?: string;
  minimumPrice?: string;
  maximumPrice?: string;
  sort?: string;
};

const controlClass = "h-12 w-full rounded-sm border border-navy/15 bg-white px-3 text-sm text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

export function PropertySearch({ values = {}, compact = false }: { values?: SearchValues; compact?: boolean }) {
  return (
    <form
      action="/propiedades"
      method="get"
      className={`grid gap-3 rounded-sm bg-white p-4 shadow-[0_18px_55px_rgba(1,22,51,0.12)] sm:grid-cols-2 ${compact ? "lg:grid-cols-[1fr_1.35fr_1fr_1fr_auto] lg:items-end" : "lg:grid-cols-[1fr_1.5fr_1fr_1fr_auto] lg:items-end lg:p-6"}`}
    >
      <label className="block text-xs font-medium text-slate">
        Operación
        <select name="operation" defaultValue={values.operation ?? ""} className={`${controlClass} mt-2`}>
          <option value="">Cualquier operación</option>
          <option value="venta">Comprar</option>
          <option value="alquiler">Alquilar</option>
          <option value="alquiler_temporal">Alquiler temporal</option>
        </select>
      </label>
      <label className="block text-xs font-medium text-slate">
        Ubicación
        <input
          name="location"
          defaultValue={values.location ?? ""}
          placeholder="Barrio o localidad"
          className={`${controlClass} mt-2`}
        />
      </label>
      <label className="block text-xs font-medium text-slate">
        Tipo de propiedad
        <select name="type" defaultValue={values.type ?? ""} className={`${controlClass} mt-2`}>
          <option value="">Todos los tipos</option>
          <option>Departamento</option>
          <option>Casa</option>
          <option>PH</option>
          <option>Otro</option>
          <option>Lote</option>
          <option>Depósito</option>
          <option>Local comercial</option>
          <option>Cochera</option>
          <option>Oficina</option>
        </select>
      </label>
      <label className="block text-xs font-medium text-slate">
        Subtipo de propiedad
        <select name="subtype" defaultValue={values.subtype ?? ""} className={`${controlClass} mt-2`}>
          <option value="">Todos los subtipos</option>
          {propertySubtypes.map((subtype) => <option key={subtype}>{subtype}</option>)}
        </select>
      </label>
      <Button type="submit" variant="primary" className={`rounded-sm ${compact ? "sm:col-span-2 lg:col-span-1" : "lg:px-7"}`}>
        <Icon name="search" className="size-4" />
        Buscar propiedades
      </Button>
      <AnimatedDisclosure
        className="sm:col-span-2 lg:col-span-5"
        initiallyOpen={Boolean(values.rooms || values.currency || values.minimumPrice || values.maximumPrice || (values.sort && values.sort !== "newest"))}
        label="Más filtros"
      >
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs font-medium text-slate">
            Ambientes
            <select name="rooms" defaultValue={values.rooms ?? ""} className={`${controlClass} mt-2`}>
              <option value="">Indiferente</option>
              <option value="1">1 o más</option>
              <option value="2">2 o más</option>
              <option value="3">3 o más</option>
              <option value="4">4 o más</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-slate">
            Moneda
            <select name="currency" defaultValue={values.currency ?? ""} className={`${controlClass} mt-2`}>
              <option value="">Cualquier moneda</option>
              <option value="ARS">Pesos argentinos (ARS)</option>
              <option value="USD">Dólares (USD)</option>
            </select>
          </label>
          <label className="block text-xs font-medium text-slate">
            Precio mínimo
            <FormattedAmountInput name="minimumPrice" value={values.minimumPrice} placeholder="Sin mínimo" className={`${controlClass} mt-2`} />
          </label>
          <label className="block text-xs font-medium text-slate">
            Precio máximo
            <FormattedAmountInput name="maximumPrice" value={values.maximumPrice} placeholder="Sin máximo" className={`${controlClass} mt-2`} />
          </label>
          <label className="block text-xs font-medium text-slate sm:col-span-2 lg:col-span-1">
            Ordenar por
            <select name="sort" defaultValue={values.sort ?? "newest"} className={`${controlClass} mt-2`}>
              <option value="newest">Más recientes</option>
              <option value="price_asc">Menor precio</option>
              <option value="price_desc">Mayor precio</option>
            </select>
          </label>
        </div>
      </AnimatedDisclosure>
    </form>
  );
}
