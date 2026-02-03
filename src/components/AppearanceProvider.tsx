"use client";

import { useEffect, useState } from "react";
import { VisualsService } from "@/services/visuals";

export default function AppearanceProvider({ children }: { children: React.ReactNode }) {
    const [accentColor, setAccentColor] = useState("#A855F7");

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await VisualsService.getSettings();
            if (settings) {
                const { branding, globalDesign } = settings;

                // Inject Branding
                document.title = `${branding.siteName} | ${branding.tagline}`;

                if (globalDesign) {
                    const { colors, typography } = globalDesign;

                    // Inject Global Colors (mapping to existing globals.css vars)
                    document.documentElement.style.setProperty('--accent-color', colors.primary);
                    document.documentElement.style.setProperty('--neon-purple', colors.primary);
                    document.documentElement.style.setProperty('--neon-accent', colors.accent);
                    document.documentElement.style.setProperty('--background', colors.background);

                    // For custom component usage
                    Object.entries(colors).forEach(([key, value]) => {
                        document.documentElement.style.setProperty(`--brand-${key}`, value as string);
                    });

                    // Inject Global Typography
                    document.documentElement.style.setProperty('--font-display', typography.display);
                    document.documentElement.style.setProperty('--font-sans', typography.body);
                    document.documentElement.style.setProperty('--font-body', typography.body);
                }
            }
        };

        loadSettings();
    }, []);

    return (
        <div style={{ '--accent-color': accentColor } as any} className="contents">
            {children}
        </div>
    );
}
