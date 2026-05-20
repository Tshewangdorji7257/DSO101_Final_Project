// Common styles and utilities for blog components
export const blogStyles = {
  // Card styles
  card: {
    featured:
      "group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500",
    grid: "md:grid-cols-2 gap-0",
    regular:
      "group cursor-pointer overflow-hidden border shadow hover:shadow-md transition-all duration-300",
  },

  // Image styles
  image: {
    aspect: "relative aspect-[4/3] md:aspect-auto overflow-hidden",
  },

  // Text styles
  text: {
    emptyState: "text-center py-20",
    emptyStateMessage: "text-muted-foreground text-lg",
    heading: "font-serif text-2xl font-bold",
    category: "text-xs uppercase tracking-wider text-primary font-semibold",
    title: "font-serif text-lg md:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2",
    excerpt:
      "text-muted-foreground text-sm line-clamp-2 group-hover:text-foreground/80 transition-colors",
    date: "text-xs text-muted-foreground",
  },

  // Layout styles
  layout: {
    container: "max-w-6xl mx-auto px-6 pb-20",
    grid2: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
    divider: "flex-1 h-px bg-border",
    headerGap: "flex items-center gap-4 mb-10",
  },

  // Buttons
  buttons: {
    container: "absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
    action: "h-8 w-8 rounded-full bg-background/90 hover:bg-background border shadow-sm",
    icon: "h-4 w-4",
  },
};
