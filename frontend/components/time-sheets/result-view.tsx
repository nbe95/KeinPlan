import { faEnvelopeOpenText, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useCallback, useContext, useMemo } from "react";
import { Button, Col, Row } from "react-bootstrap";
import strftime from "strftime";
import { BackendInfoContext } from "../../utils/backend-info";
import {
  API_ENDPOINT_TIME_SHEET,
  TIME_SHEET_DEFAULT_MAIL,
  TIME_SHEET_QUERY_KEY,
} from "../../utils/constants";
import { getWeek } from "../../utils/dates";
import { MailProps, createMailToLink } from "../../utils/mail";
import { ClientError, isClientError, retryUnlessClientError } from "../../utils/network";
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

  const getEndpointUrl = useCallback((): string => {
    return new URL(
      `${API_ENDPOINT_TIME_SHEET}/${props.timeSheetParams?.type.toLowerCase()}/${props.timeSheetParams?.format.toLowerCase()}`,
      window.location.href,
    ).toString();
  }, [props.timeSheetParams]);

  const getTimeSheetName = useCallback((): string => {
    const basename: string = "Arbeitszeit";
    const timestamp: string = `${props.timeSheetParams?.targetDate.getFullYear()}-${getWeek(props.timeSheetParams?.targetDate)}`;
    const format: string = props.timeSheetParams?.format.toLocaleLowerCase();
    return `${basename}_${timestamp}.${format}`;
  }, [props.timeSheetParams?.targetDate, props.timeSheetParams?.format]);

  const toIsoTime = (date: Date): string => strftime("%Y-%m-%dT%H:%M:%S%z", date);

  const {
    data: pdf,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [TIME_SHEET_QUERY_KEY, props.timeSheetParams, props.userData],
    queryFn: async () => {
      return await axios
        .post(
          getEndpointUrl(),
          {
            employer: props.userData.employer,
            employee: `${props.userData.lastName}, ${props.userData.firstName}`,
            year: props.timeSheetParams.targetDate.getFullYear(),
            week: getWeek(props.timeSheetParams.targetDate),
            dates: props.dateList.map((date) => ({
              ...date,
              time: {
                begin: toIsoTime(date.time.begin),
                end: toIsoTime(date.time.end),
              },
              break: date.break
                ? {
                    begin: toIsoTime(date.break.begin),
                    end: toIsoTime(date.break.end),
                  }
                : null,
            })),
          },
          {
            headers: {
              "Content-type": "application/json",
            },
            responseType: "blob",
          },
        )
        .then((response) => {
          // Store the result as blob object and return its URL
          const url = URL.createObjectURL(new Blob([response.data]));
          return {
            fileName: getTimeSheetName(),
            blobUrl: url,
            size: response.data.size,
          };
        })
        .catch((error) => {
          const msg: string =
            error.response.data ??
            `The backend query returned status code ${error.response.status}.`;
          if (isClientError(error.response.status)) {
            throw new ClientError(msg);
          }
          throw Error(msg);
        });
    },
    retry: (count, error) => retryUnlessClientError(error, count, 5),
    // Fetch only once
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const mailParams = useMemo((): MailProps => {
    const name: string = `${props.userData.firstName} ${props.userData.lastName}`;
    const week: string = `${getWeek(props.timeSheetParams.targetDate)}/${props.timeSheetParams.targetDate.getFullYear()}`;
    return {
      recipient: TIME_SHEET_DEFAULT_MAIL ?? "",
      subject: `Arbeitszeit ${name} - KW ${week}`,
      body: `Guten Tag,\n\nanbei erhalten Sie die Auflistung meiner Arbeitszeit für die Kalenderwoche ${week}.\n\nViele Grüße\n${name}`,
    };
  }, [props.userData, props.timeSheetParams]);

  return (
    <>
      <h3 className="mb-4 mt-5">Schritt 3: Fertig!</h3>
      {isError ? (
        <Row>
          <Col className="py-3">
            <MsgBox type="error" trace={error.message}>
              Oh no, da hat was nicht geklappt! Deine Stundenliste konnte nicht erstellt werden. 😭
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
          <Col sm={12} md={7}>
            <div className="text-center m-4 p-4 bg-light rounded">
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
          <Col sm={12} md={5}>
            <p className="lead">Wie geht&apos;s jetzt weiter?</p>
            <p>
              Lade deine Stundenliste runter. Sende sie anschließend an das zuständige Pfarrbüro per
              E-Mail, z.B. mit der folgenden Vorlage.
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
