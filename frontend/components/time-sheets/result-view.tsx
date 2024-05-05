import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";
import { useDownloadFile } from "../../hooks/download-file";
import { API_ENDPOINT_TIME_SHEET } from "../../utils/constants";
import { getWeek } from "../../utils/dates";
import { TimeSheetData, TimeSheetDate, UserData } from "./common";

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

  const { ref, url, download, name } = useDownloadFile({
    apiDefinition: () => {
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
    preDownloading: () => {
      console.log("pre");
    },
    postDownloading: () => {
      console.log("post");
    },
    onError: (error) => {
      console.log(error);
    },
    getFileName: getTimeSheetName,
  });

  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 3: Fertig!</h3>

      <Row>
        <Col>
          <Button variant="primary" onClick={download}>
            <Stack direction="vertical" gap={1}>
              <FontAwesomeIcon icon={faDownload} size="4x" className="m-3" />
              <span>Download</span>
            </Stack>
          </Button>
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
