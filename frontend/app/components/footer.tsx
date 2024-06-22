const Footer = () => {
  return (
    <footer className="pt-5 my-5 text-muted border-top">
      Created by the Bootstrap team &middot; &copy; 2024
    </footer>

    // <footer className="bg-light">
    //   <Container className="bg-light text-muted">
    //     {/* {versionFrontend &&
    //       info.version?.KeinPlanBackend &&
    //       info.version?.KeinPlanBackend != versionFrontend && (
    //         <MsgBox type="error">
    //           Auf diesem Server läuft eine andere Backend-Version ({info.version.KeinPlanBackend}),
    //           sodass es zu Fehlfunktionen kommen kann.
    //           <br />
    //           Bitte aktualisiere die Software bzw. Docker Images!
    //         </MsgBox>
    //       )} */}
    //     <Stack direction="horizontal" gap={3}>
    //       {GITHUB_LINK && (
    //         <div>
    //           <Link
    //             href={GITHUB_LINK}
    //             className="text-muted"
    //             title="KeinPlan auf Github"
    //             target="_blank"
    //           >
    //             <FontAwesomeIcon icon={faGithub} size="xl" />
    //           </Link>
    //         </div>
    //       )}
    //       <div className="me-auto">
    //         KeinPlan {VERSION_FRONTEND ? `v${VERSION_FRONTEND}` : "(unbekannte Version)"}
    //       </div>
    //       <Stack direction="horizontal" gap={3}>
    //         {KAPLAN_LINK && (
    //           <Link
    //             href={KAPLAN_LINK}
    //             className="text-muted link-underline link-underline-secondary link-underline-opacity-25 link-underline-opacity-75-hover"
    //             title="KaPlan Web öffnen"
    //             target="_blank"
    //           >
    //             KaPlan Web
    //           </Link>
    //         )}
    //         {ADMIN_MAIL && (
    //           <Link
    //             href={`mailto:${ADMIN_MAIL}`}
    //             className="text-muted link-underline link-underline-secondary link-underline-opacity-25 link-underline-opacity-75-hover"
    //             title="E-Mail an den Administrator"
    //             target="_blank"
    //           >
    //             Kontakt
    //           </Link>
    //         )}
    //       </Stack>
    //     </Stack>
    //   </Container>
    // </footer>
  );
};

export default Footer;
