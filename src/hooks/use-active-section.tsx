import * as React from "react";

export function useActiveSection(ids: string[]) {
  const [active, setActive] = React.useState<string | null>(null);
  const idsKey = ids.join(",");

  React.useEffect(() => {
    const sectionIds = idsKey.split(",");
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [idsKey]);

  return active;
}
