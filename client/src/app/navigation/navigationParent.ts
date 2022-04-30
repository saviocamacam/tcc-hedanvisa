import { FuseNavigation } from "@fuse/types";

export const navigationParent: FuseNavigation[] = [
    {
        id: "applications",
        title: "APLICAÇÕES",
        translate: "NAV.APPLICATIONS",
        type: "group",
        children: [
            {
                id: "assestments",
                title: "AVALIAÇÕES",
                type: "collapsable",
                icon: "library_books",
                children: [
                    {
                        id: "overview",
                        title: "VISÃO GERAL",
                        type: "item",
                        url: "/familia/avaliacoes/visaogeral"
                    },
                    {
                        id: "feedback",
                        title: "FEEDBACK",
                        type: "item",
                        url: "/familia/avaliacoes/feedback"
                    }
                ]
            },
            {
                id: "tasks",
                title: "EVENTOS",
                type: "item",
                icon: "insert_invitation",
                url: "/familia/eventos"
            },
            {
                id: "tasks",
                title: "BOLETIM",
                type: "item",
                icon: "email",
                url: "/familia/boletim"
            },
            {
                id: "parentuniversity",
                title: "APP",
                type: "collapsable",
                icon: "supervisor_account",
                children: [
                    {
                        id: "func1",
                        title: "FUNCIONALIDADE 1",
                        type: "item",
                        url: "/sample"
                    },
                    {
                        id: "func2",
                        title: "FUNCIONALIDADE 2",
                        type: "item",
                        url: "/sample"
                    }
                ]
            }
        ]
    }
];
