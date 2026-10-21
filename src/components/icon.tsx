import {
  IconArrowLeft,
  IconArrowRight,
  IconBath,
  IconBed,
  IconBrandWhatsapp,
  IconChevronLeft,
  IconChevronRight,
  IconCompass,
  IconDimensions,
  IconBuilding,
  IconHome,
  IconMail,
  IconLogin2,
  IconMaximize,
  IconMapPin,
  IconSearch,
  IconX,
} from "@tabler/icons-react";

const icons = {
  arrow: IconArrowRight,
  back: IconArrowLeft,
  area: IconDimensions,
  bath: IconBath,
  bed: IconBed,
  building: IconBuilding,
  compass: IconCompass,
  close: IconX,
  next: IconChevronRight,
  previous: IconChevronLeft,
  home: IconHome,
  login: IconLogin2,
  mail: IconMail,
  expand: IconMaximize,
  pin: IconMapPin,
  search: IconSearch,
  whatsapp: IconBrandWhatsapp,
};

export function Icon({ name, className }: { name: keyof typeof icons; className?: string }) {
  const TablerIcon = icons[name];
  return <TablerIcon aria-hidden="true" className={className} />;
}
