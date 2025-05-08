import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-white text-black">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
