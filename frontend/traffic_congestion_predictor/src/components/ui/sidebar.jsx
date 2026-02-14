import * as React from "react";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef(({ className, style, children, ...props }, ref) => (
  <SidebarContext.Provider value={{ state: "expanded", open: true, setOpen: () => {}, openMobile: false, setOpenMobile: () => {}, isMobile: false, toggleSidebar: () => {} }}>
    <div ref={ref} className={className} style={style} {...props}>{children}</div>
  </SidebarContext.Provider>
));
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>{children}</div>
));
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef((props, ref) => <button ref={ref} {...props} />);
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef((props, ref) => <button ref={ref} {...props} />);
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => <main ref={ref} className={className} {...props} />);
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef((props, ref) => <input ref={ref} {...props} />);
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />);
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />);
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef((props, ref) => <hr ref={ref} {...props} />);
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />);
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={className} {...props} />);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarGroupAction = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => <ul ref={ref} className={className} {...props} />);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef((props, ref) => <li ref={ref} {...props} />);
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef(({ className, ...props }, ref) => <ul ref={ref} className={className} {...props} />);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef((props, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef((props, ref) => <div ref={ref} {...props} />);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
