import { useLocation } from "react-router-dom";
import { CommandPalette, ShortcutsHelpModal, useKeyboardShortcuts } from "./CommandPalette";

export function ShortcutsProvider() {
  const { paletteOpen, setPaletteOpen, helpOpen, setHelpOpen } = useKeyboardShortcuts();
  const location = useLocation();

  // Try to grab user from route state (set during login/register/navigation)
  const user = location.state && typeof location.state === "object" ? location.state : null;

  return (
    <>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        user={user}
      />
      <ShortcutsHelpModal
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </>
  );
}
