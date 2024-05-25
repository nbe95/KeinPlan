import { faEnvelopeOpenText, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useContext, useMemo } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { BackendInfoContext } from "../../utils/backend-info";
import { API_ENDPOINT_TIME_SHEET, TIME_SHEET_QUERY_KEY } from "../../utils/constants";
import { getWeek } from "../../utils/dates";
import { MailProps, createMailToLink } from "../../utils/mail";
import LoadingSpinner from "../loading";
import MsgBox from "../msg-box";
import { TimeSheetDate, TimeSheetParams, UserData } from "./common";
import DownloadButton from "./download-button";
import { PrevButton } from "./process-button";

type ResultViewProps = {
  userData: UserData;
  timeSheetParams: TimeSheetParams;
  dateList: TimeSheetDate[];
  prevStep: () => void;
};

const ResultView = (props: ResultViewProps) => {
  const info: any = useContext(BackendInfoContext);

  const getEndpointUrl = useCallback((): URL => {
    return new URL(
      `${API_ENDPOINT_TIME_SHEET}/${props.timeSheetParams?.type.toLowerCase()}/${props.timeSheetParams?.format.toLowerCase()}`,
      window.location.href,
    );
  }, [props.timeSheetParams]);

  const getTimeSheetName = useCallback((): string => {
    const basename: string = "Arbeitszeit";
    const timestamp: string = `${props.timeSheetParams?.targetDate.getFullYear()}-${getWeek(props.timeSheetParams?.targetDate)}`;
    const format: string = props.timeSheetParams?.format.toLocaleLowerCase();
    return `${basename}_${timestamp}.${format}`;
  }, [props.timeSheetParams?.targetDate, props.timeSheetParams?.format]);

  const {
    data: pdf,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [TIME_SHEET_QUERY_KEY, props.timeSheetParams, props.userData],
    queryFn: async () => {
      const response = await fetch(getEndpointUrl(), {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          employer: props.userData.employer,
          employee: `${props.userData.lastName}, ${props.userData.firstName}`,
          year: props.timeSheetParams.targetDate.getFullYear(),
          week: getWeek(props.timeSheetParams.targetDate),
          dates: props.dateList,
        }),
      });
      // Store the result as blob object and return its URL
      const data = await response.blob();
      const url = URL.createObjectURL(new Blob([data]));
      return {
        fileName: getTimeSheetName(),
        blobUrl: url,
        size: data.size,
      };
    },
    // Fetch only once
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // ToDo(Niklas): Create an interface etc.?
  const mailParams = useMemo(
    (): MailProps => ({
      // ToDo(Niklas): Use correct recipient by env var
      recipient: "test@test.test",
      subject: `Arbeitszeit ${props.userData.lastName}, ${props.userData.firstName} - KW ${getWeek(props.timeSheetParams.targetDate)}/${props.timeSheetParams.targetDate.getFullYear()}`,
      body: `Guten Tag,\n\nanbei erhalten Sie die Auflistung meiner wöchentlichen Arbeitszeit für die vergangenen Kalenderwoche.\n\nViele Grüße\n${props.userData.firstName} ${props.userData.lastName}`,
    }),
    [props.userData, props.timeSheetParams],
  );

  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 3: Fertig!</h3>
      {isError ? (
        <Row>
          <Col>
            <MsgBox type="error" trace={error.message}>
              Oh no, das hat nicht geklappt! Die Stundenliste konnte nicht erstellt werden. 😭
              <br />
              Probier&apos;s später nochmal. Falls das Problem weiterhin besteht, melde dich bitte
              beim{" "}
              {info.env?.AdminMail ? (
                <Link href={`mailto:${info.env.AdminMail}`}>Admin</Link>
              ) : (
                <span>Admin</span>
              )}
              .
            </MsgBox>
          </Col>
        </Row>
      ) : (
        <Row className="align-items-center">
          <Col sm={12} md={6}>
            <div className="text-center m-4 py-4 bg-light rounded">
              {isLoading ? (
                <div className="my-4">
                  <LoadingSpinner message="Working hard..." />
                </div>
              ) : (
                <>
                  <h5>Deine Stundenliste ist fertig! 🎉</h5>
                  <DownloadButton
                    fileName={pdf.fileName}
                    url={pdf.blobUrl}
                    text="Download als PDF"
                    size={pdf.size}
                    faIcon={faFileArrowDown}
                    isPrimary={true}
                  />
                </>
              )}
            </div>
          </Col>
          <Col sm={12} md={6}>
            <p className="lead">Wie geht&apos;s jetzt weiter?</p>
            <p>
              Lade deine Stundenliste runter. Sende sie dann dem zuständigen Pfarrbüro per E-Mail,
              z.B. mit der folgenden Vorlage.
            </p>
            <p>Überprüfe vorher nochmal alles auf Richtigkeit.</p>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                window.location.href = createMailToLink(mailParams);
              }}
            >
              <FontAwesomeIcon icon={faEnvelopeOpenText} className="me-2" />
              Mail-Vorlage öffnen
            </Button>
          </Col>
        </Row>
      )}
      {!isError && (
        <Row className="my-2">
          <Col>
            <MsgBox type="info">
              {/* ToDo(Niklas): Implement link */}
              Nimm doch diesen Link beim nächsten Mal, damit&apos;s schneller geht...
            </MsgBox>
          </Col>
        </Row>
      )}
      <Row>
        <Col className="d-flex justify-content-start">
          <PrevButton callback={props.prevStep} />
        </Col>
      </Row>
    </>
  );
};

export default ResultView;
