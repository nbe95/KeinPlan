import { faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { API_ENDPOINT_TIME_SHEET, TIME_SHEET_QUERY_KEY } from "../../utils/constants";
import { getWeek } from "../../utils/dates";
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
  const getEndpointUrl = useCallback((): URL => {
    return new URL(
      `${API_ENDPOINT_TIME_SHEET}/${props.timeSheetParams?.type.toLowerCase()}/${props.timeSheetParams?.format.toLowerCase()}`,
      window.location.href,
    );
  }, [props.timeSheetParams?.type, props.timeSheetParams?.format]);

  const getTimeSheetName = useCallback((): string => {
    const basename: string = "Arbeitszeit";
    const timestamp: string = `${props.timeSheetParams?.targetDate.getFullYear()}-${getWeek(props.timeSheetParams?.targetDate)}`;
    const format: string = props.timeSheetParams?.format.toLocaleLowerCase();
    return `${basename}_${timestamp}.${format}`;
  }, [props.timeSheetParams?.targetDate, props.timeSheetParams?.format]);

  const {
    data: pdf,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useQuery({
    queryKey: [TIME_SHEET_QUERY_KEY],
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
      const url = URL.createObjectURL(new Blob([await response.blob()]));
      return {
        fileName: getTimeSheetName(),
        blobUrl: url,
      };
    },
    // Fetch only once
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // ToDo(Niklas): Create an interface etc.?
  const mailParams = useMemo(() => {
    return {
      // ToDo(Niklas): Use correct recipient by env var
      recipient: "test@test.test",
      subject: `Arbeitszeit ${props.userData.lastName}, ${props.userData.firstName} - KW ${getWeek(props.timeSheetParams.targetDate)}/${props.timeSheetParams.targetDate.getFullYear()}`,
      body: `Guten Tag,\n\nanbei erhalten Sie die Auflistung meiner wöchentlichen Arbeitszeit für die vergangenen Kalenderwoche.\n\nViele Grüße\n${props.userData.firstName} ${props.userData.lastName}`,
    };
  }, [props.userData, props.timeSheetParams]);

  const createMailToLink = (props: {
    recipient: string;
    subject?: string;
    body?: string;
  }): string =>
    `mailto:${props.recipient}?subject=${encodeURIComponent(props.subject)}&body=${encodeURIComponent(props.body)}`;

  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 3: Fertig!</h3>
      <Row>
        <Col sm={12} md={6} className="my-3">
          {isLoading ? (
            <LoadingSpinner message="Working hard..." />
          ) : isSuccess ? (
            <div className="text-center">
              <p>
                <strong>Deine Stundenliste ist fertig! 🎉</strong>
              </p>
              <DownloadButton
                fileName={pdf.fileName}
                url={pdf.blobUrl}
                text="Download als PDF"
                faIcon={faFileArrowDown}
                isPrimary={true}
              />
            </div>
          ) : (
            <MsgBox type="error" trace={error.message}>
              Oh no! Die Stundenliste konnte nicht erstellt werden. 😭
            </MsgBox>
          )}
        </Col>
        <Col sm={12} md={6} className="my-3 border-start">
          <p className="lead">Wie geht&apos;s jetzt weiter?</p>
          <p>Überprüfe vorher nochmal alle Daten. Sende dem Pfarrbüro eine E-Mail.</p>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              window.location.href = createMailToLink(mailParams);
            }}
          >
            Mail-Vorlage öffnen
          </Button>
        </Col>
      </Row>
      <Row className="my-2">
        <Col>
          <MsgBox type="info">
            {/* ToDo(Niklas): Implement link */}
            Nimm doch diesen Link beim nächsten Mal, damit&apos;s schneller geht...
          </MsgBox>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-start">
          <PrevButton callback={props.prevStep} />
        </Col>
      </Row>
    </>
  );
};

export default ResultView;
