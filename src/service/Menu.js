const Menu = [
  {
    label: "Timbrature",
    roles: ["Staff"],
    data: [
      // {
      //   label: "Dashboard",
      //   icon: ["far", "user"],
      //   to: "/dashboard",
      //   roles: ["Admin"],
      // },
      {
        label: "Timbra",
        // icon: ["far", "user"],
        icon: ["fas", "clock"],
        to: "/home",
        roles: ["Admin","Staff"],
      },
      {
        label: "Calendario",
        icon: ["far", "calendar"],
        to: "/calendario",
        roles: ["Admin","Staff"],
      },
      {
        label: "Staff Overview",
        icon: ["fas", "magnifying-glass"],
        // <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        to: "/staff-overview",
        roles: ["Admin"],
      },

    ],
  },
  {
    label: "Profilo",
    roles: ["Admin","Staff"],
    data: [
            {
        label: "Impostazioni Profilo",
        icon: ["fas", "gear"],
        to: "/impostazioni-profilo",
        roles: ["Admin","Staff"],
      },
      // {
      //   label: "Campagne",
      //   icon: ["fas", "headset"],
      //   to: "/campagne",
      //   roles: ["Staff"],
      // },
      {
        label: "Tipo campagna",
        icon: ["fas", "sliders"],
        to: "/tipo-campagna",
        roles: ["System Admin"],
      },
      {
        label: "Clienti",
        icon: ["fas", "user-tie"],
        to: "/clienti",
        roles: ["System Admin"],
      },
      {
        label: "Task",
        icon: ["fas", "list-check"],
        to: "/task",
        roles: ["System Admin"],
      },
      {
        label: "Utenti",
        icon: ["fas", "users"],
        to: "/utenti",
        roles: ["Admin"],
      },
    ],
  },
];

export default Menu;
