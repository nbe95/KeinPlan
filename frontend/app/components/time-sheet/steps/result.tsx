import { faEnvelopeOpenText, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useMemo } from "react";
import { Button, Col, Row } from "react-bootstrap";
import {
  ADMIN_MAIL,
  API_ENDPOINT_TIME_SHEET,
  TIME_SHEET_MAIL,
  TIME_SHEET_QUERY_KEY,
} from "../../../utils/constants";
import { dictConvertDatesToIsoString, getWeek } from "../../../utils/dates";
import { MailProps, createMailToLink } from "../../../utils/mail";
import { catchQueryError, retryUnlessClientError } from "../../../utils/network";
import DownloadButton from "../../download-button";
import { CondLink } from "../../link";
import LoadingSpinner from "../../loading";
import MsgBox from "../../msg-box";
import { PrevButton } from "../../process-button";
import { DateEntry, UserData } from "../generator";

type ResultProps = {
  userData: UserData;
  targetDate: Date;
  dateList: DateEntry[];
  prevStep: () => void;
};

const ResultStep = (props: ResultProps) => {
  const getEndpointUrl = (format: string): string => {
    const type: string = "weekly";
    return new URL(`${API_ENDPOINT_TIME_SHEET}/${type}/${format}`, window.location.href).toString();
  };

  const getTimeSheetName = useCallback(
    (format: string): string => {
      const targetDate: Date = props.targetDate;
      const basename: string = "Arbeitszeit";
      const timestamp: string = `${targetDate.getFullYear()}-${getWeek(targetDate)}`;
      return `${basename}_${timestamp}.${format.toLowerCase()}`;
    },
    [props.targetDate],
  );

  const {
    data: pdf,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [TIME_SHEET_QUERY_KEY, props.targetDate, props.userData, props.dateList],
    queryFn: async () => {
      return await axios
        .post(
          getEndpointUrl("pdf"),
          {
            employer: props.userData.employer,
            employee: `${props.userData.lastName}, ${props.userData.firstName}`,
            year: props.targetDate.getFullYear(),
            week: getWeek(props.targetDate),
            dates: props.dateList.map((date) => dictConvertDatesToIsoString(date)),
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
            fileName: getTimeSheetName("pdf"),
            blobUrl: url,
            size: response.data.size,
          };
        })
        .catch((error) => catchQueryError(error));
    },
    retry: (count, error) => retryUnlessClientError(error, count, 5),
    staleTime: 1000 * 60 * 10, // 10 minutes until stale
    refetchOnWindowFocus: false,
  });

  const mailParams = useMemo((): MailProps => {
    const firstLastName: string = `${props.userData.firstName} ${props.userData.lastName}`;
    const lastFirstName: string = `${props.userData.lastName}, ${props.userData.firstName}`;
    const week: string = getIsoWeekAndYear(props.targetDate);
    return {
      recipient: TIME_SHEET_MAIL ?? "",
      subject: `Arbeitszeit ${lastFirstName} - KW ${week}`,
      body: `Guten Tag,\n\nanbei übersende ich die wöchentliche Auflistung meiner Arbeitszeit für die Kalenderwoche ${week}.\n\nViele Grüße\n${firstLastName}`,
    };
  }, [props.userData, props.targetDate]);

  return (
    <>
      {isError ? (
        <Row>
          <Col className="mb-4">
            <MsgBox type="error" trace={error.message}>
              Oh no, da hat etwas nicht geklappt! Deine Stundenliste konnte nicht erstellt werden.
              😭
              <br />
              Probier&apos;s später nochmal. Falls das Problem weiterhin besteht, melde dich bitte
              beim{" "}
              <CondLink
                condition={!!ADMIN_MAIL}
                href={createMailToLink({ recipient: ADMIN_MAIL! })}
              >
                Admin
              </CondLink>
              .
            </MsgBox>
          </Col>
        </Row>
      ) : (
        <>
          <p className="lead">Das war&apos;s schon! 🎉</p>
          <Row className="align-items-center mb-5">
            <Col sm={12} md={6}>
              <div className="text-center m-4 p-4 bg-light rounded">
                {isLoading || !pdf ? (
                  <div className="my-4">
                    <LoadingSpinner message="Working hard…" />
                  </div>
                ) : (
                  <>
                    <h5>Hier ist deine Stundenliste:</h5>
                    <DownloadButton
                      fileName={pdf.fileName}
                      url={pdf.blobUrl}
                      text={`KW ${getWeek(props.targetDate)}/${props.targetDate.getFullYear()}`}
                      size={pdf.size}
                      faIcon={faFilePdf}
                      isPrimary={true}
                    />
                  </>
                )}
              </div>
            </Col>
            <Col sm={12} md={6}>
              <h2>Wie geht&apos;s jetzt weiter?</h2>
              <p>
                Lade deine Stundenliste runter. Sende anschlie&shy;ßend eine E-Mail an das
                zustän&shy;dige Pfarr&shy;büro und hänge sie als Anhang an. Nutze dazu gerne die
                folgende Vorlage.
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
        </>
      )}
      <Row>
        <Col className="d-flex justify-content-start order-1">
          <PrevButton callback={props.prevStep} />
        </Col>
      </Row>
    </>
  );
};

export default ResultStep;
