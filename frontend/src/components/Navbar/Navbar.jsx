import { useState, useEffect } from "react";
import {
  IconBooks,
  IconCategoryFilled,
  IconHome,
  IconInfoCircle,
  IconLogout,
  IconMail,
  IconShoppingCart,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { SegmentedControl } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";
import classes from "./Navbar.module.css";

const tabs = {
  Main: [
    { link: "/", label: "Home", icon: IconHome },
    { link: "/Category", label: "Category", icon: IconCategoryFilled },
    { link: "/About", label: "About", icon: IconInfoCircle },
    { link: "/Contact", label: "Contact", icon: IconMail },
  ],
  Admin: [
    { link: "/Orders", label: "Orders", icon: IconShoppingCart },
    { link: "/Products", label: "Products", icon: IconBooks },
    { link: "/Customers", label: "Customers", icon: IconUsers },
  ],
};

export function NavbarPage() {
  const [section, setSection] = useState("Admin");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    // Set the initial section based on the current location path
    if (
      location.pathname.includes("Orders") ||
      location.pathname.includes("Products") ||
      location.pathname.includes("Customers")
    ) {
      setSection("Admin");
    } else {
      setSection("Main");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = tabs[section].map((item) => (
    <div
      key={item.label}
      className={classes.link}
      data-active={location.pathname === item.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </div>
  ));

  return (
    <nav className={classes.navbar}>
      <div>
        <SegmentedControl
          value={section}
          onChange={(value) => setSection(value)}
          fullWidth
          data={[
            { label: "Main", value: "Main" },
            { label: "Admin", value: "Admin" },
          ]}
        />
      </div>

      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <div
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            navigate("/profile");
          }}
        >
          <IconUserCircle className={classes.linkIcon} stroke={1.5} />
          <span>Profile</span>
        </div>
        <div
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </div>
      </div>
    </nav>
  );
}
