export const GA_ID = "G-Q0P6Y748W1"

// Відправка подій у GA4
export const event = ({
                          action,
                          category,
                          label,
                          value,
                      }: {
    action: string
    category: string
    label: string
    value?: number
}) => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", action, {
            event_category: category,
            event_label: label,
            value,
        })
    }
}
