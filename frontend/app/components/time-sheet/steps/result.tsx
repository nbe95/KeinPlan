import { faEnvelopeOpenText, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { Button, Col, Row } from "react-bootstrap";
import {
  ADMIN_MAIL,
  API_ENDPOINT_TIME_SHEET,
  TIME_SHEET_MAIL,
  TIME_SHEET_QUERY_KEY,
} from "../../../utils/constants";
import { convertDatesToIsoString, getWeek } from "../../../utils/dates";
import { MailProps, createMailToLink } from "../../../utils/mail";
import { ClientError, isClientError, retryUnlessClientError } from "../../../utils/network";
import DownloadButton from "../../download-button";
import LoadingSpinner from "../../loading";
import MsgBox from "../../msg-box";
import { PrevButton } from "../../process-button";
import { TimeSheetDate, TimeSheetFormat, TimeSheetParams, UserData } from "../generator";

type ResultProps = {
  userData: UserData;
  timeSheetParams: TimeSheetParams;
  dateList: TimeSheetDate[];
  prevStep: () => void;
};

const ResultStep = (props: ResultProps) => {
  const getEndpointUrl = useCallback((): string => {
    return new URL(
      `${API_ENDPOINT_TIME_SHEET}/${props.timeSheetParams?.type.toLowerCase()}/${props.timeSheetParams?.format.toLowerCase()}`,
      window.location.href,
    ).toString();
  }, [props.timeSheetParams]);

  const getTimeSheetName = useCallback((): string => {
    const targetDate: Date = props.timeSheetParams.targetDate;
    const format: TimeSheetFormat = props.timeSheetParams.format;

    const basename: string = "Arbeitszeit";
    const timestamp: string = `${targetDate.getFullYear()}-${getWeek(targetDate)}`;
    return `${basename}_${timestamp}.${format.toLowerCase()}`;
  }, [props.timeSheetParams.targetDate, props.timeSheetParams.format]);

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
            dates: convertDatesToIsoString(props.dateList),
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
    const user: UserData = props.userData;
    const targetDate: Date = props.timeSheetParams.targetDate;

    const name: string = `${user?.firstName} ${user?.lastName}`;
    const week: string = `${getWeek(targetDate)}/${targetDate.getFullYear()}`;
    return {
      recipient: TIME_SHEET_MAIL ?? "",
      subject: `Arbeitszeit ${name} - KW ${week}`,
      body: `Guten Tag,\n\nanbei erhalten Sie die Auflistung meiner Arbeitszeit für die Kalenderwoche ${week}.\n\nViele Grüße\n${name}`,
    };
  }, [props.userData, props.timeSheetParams]);

  return (
    <>
      {isError ? (
        <Row>
          <Col className="py-3">
            <MsgBox type="error" trace={error.message}>
              Oh no, da hat was nicht geklappt! Deine Stundenliste konnte nicht erstellt werden. 😭
              <br />
              Probier&apos;s später nochmal. Falls das Problem weiterhin besteht, melde dich bitte
              beim{" "}
              {ADMIN_MAIL ? <Link href={`mailto:${ADMIN_MAIL}`}>Admin</Link> : <span>Admin</span>}.
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
                  <h5>
                    Deine Stundenliste für KW {getWeek(props.timeSheetParams.targetDate)} ist
                    fertig! 🎉
                  </h5>
                  <DownloadButton
                    fileName={pdf?.fileName ?? ""}
                    url={pdf?.blobUrl ?? ""}
                    text="Download als PDF"
                    size={pdf?.size}
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
      <Row>
        <Col className="d-flex justify-content-start">
          <PrevButton callback={props.prevStep} />
        </Col>
      </Row>
    </>
  );
};

export default ResultStep;
