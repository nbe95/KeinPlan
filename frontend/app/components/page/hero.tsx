import Container from "./container";

const Hero = () => (
  <Container>
    <h1>Stundenliste in 1 Minute</h1>
    <p className="fs-5 col-md-10">
      Erstelle mit nur ein paar Klicks Auflistungen deiner Arbeitszeit auf Basis deiner in{" "}
      <em>KaPlan</em> hinterlegten Termine. Lade sie als PDF herunter und sende sie direkt ans
      Pfarrbüro.
    </p>
    <p className="fs-5 col-md-10">
      Ein Tool für alle, die <q>kein Plan</q> haben, warum sie manuell Stundenzettel pflegen müssen,
      obwohl alle Dienste bereits offiziell und zentral verwaltet werden.
    </p>
  </Container>
);

export default Hero;
