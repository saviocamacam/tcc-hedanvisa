import { FuseNavigation } from "@fuse/types";

export const navigationComunity: FuseNavigation[] = [
    {
        id: "applications",
        title: "APLICAÇÕES",
        translate: "NAV.APPLICATIONS",
        type: "group",
        children: [
            {
                id: "availability",
                title: "DISPONIBILIDADE",
                type: "item",
                icon: "checkbox",
                url: "/comunidade/voluntario/disponibilidade"
            },
            {
                id: "history",
                title: "HISTÓRICO",
                type: "item",
                icon: "history",
                url: "/comunidade/voluntario/historico"
            }
        ]
    }
];
