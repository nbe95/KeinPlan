import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDownloadFile } from "../../hooks/download-file";
import { API_ENDPOINT_TIME_SHEET } from "../../utils/constants";
import { getWeek } from "../../utils/dates";
import MsgBox from "../msg-box";
import { TimeSheetData, TimeSheetDate, UserData } from "./common";
import DownloadButton from "./download-button";

type ResultViewProps = {
  userData: UserData;
  timeSheetData: TimeSheetData;
  dateList: TimeSheetDate[];
  prevStep: () => void;
};

export const ResultView = (props: ResultViewProps) => {
  const getEndpointUrl = useCallback((): URL => {
    return new URL(
      `${API_ENDPOINT_TIME_SHEET}/${props.timeSheetData?.type.toLowerCase()}/${props.timeSheetData?.format.toLowerCase()}`,
      window.location.href,
    );
  }, [props.timeSheetData?.type, props.timeSheetData?.format]);

  const getTimeSheetName = useCallback((): string => {
    return `Arbeitszeit_${props.timeSheetData?.targetDate.getFullYear()}-${getWeek(props.timeSheetData?.targetDate)}.${props.timeSheetData?.format.toLowerCase()}}`;
  }, [props.timeSheetData?.targetDate, props.timeSheetData?.format]);

  const pdf = useDownloadFile({
    apiCall: () => {
      return fetch(getEndpointUrl(), {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          employer: props.userData.employer,
          employee: `${props.userData.lastName}, ${props.userData.firstName}`,
          year: props.timeSheetData.targetDate.getFullYear(),
          week: getWeek(props.timeSheetData.targetDate),
          dates: props.dateList,
        }),
      });
    },
    onError: (error) => {
      console.log(error);
    },
    downloadName: getTimeSheetName(),
  });

  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 3: Fertig!</h3>
      Deine Stundenliste ist bereit und kann heruntergeladen werden. Viel Spaß
      damit!
      <Row>
        <Col sm={12} md={6} className="my-3">
          <div className="text-center">
            <p>Wähle das passende Dateiformat aus:</p>
            <DownloadButton
              isPrimary={true}
              text="Download als PDF"
              faIcon={faFilePdf}
              download={pdf}
            />
          </div>
        </Col>
        <Col sm={12} md={6} className="my-3 border-start">
          <p className="lead">Wie geht&apos;s jetzt weiter?</p>
          <p>
            Überprüfe vorher nochmal alle Daten. Sende dem Pfarrbüro eine
            E-Mail.
          </p>
        </Col>
      </Row>
      <Row className="my-2">
        <Col>
          <MsgBox type="info">
            Nimm doch diesen Link beim nächsten Mal, damit&apos;s schneller
            geht...
          </MsgBox>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            variant="secondary"
            type="button"
            className="float-start"
            onClick={props.prevStep}
          >
            Zurück
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default ResultView;
