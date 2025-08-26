import { useEffect, useState, useCallback, forwardRef, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MhCalendar } from "./mh-cal-react/components";
import { defineCustomElements } from "mh-calendar-core/loader";
import {
  IMHCalendarConfig,
  IMHCalendarEvent,
  IMHCalendarUserApi,
} from "./types";

defineCustomElements(window);

interface ApiState {
  viewType?: string;
  currentDate?: Date;
  selectedDate?: Date;
}

export const useCalendarApi = (calendarRef: React.RefObject<any>) => {
  const [api, setApi] = useState<null | IMHCalendarUserApi>(null);
  const [isReady, setIsReady] = useState(false);
  const [apiState, setApiState] = useState<ApiState>({});

  const updateApiState = useCallback(() => {
    if (api) {
      const newState: ApiState = {
        ...api,
      };
      setApiState((prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(newState)) {
          return newState;
        }
        return prevState;
      });
    }
  }, [api]);

  useEffect(() => {
    if (!calendarRef.current) return;

    let isComponentMounted = true;
    let pollAttempts = 0;
    const maxAttempts = 50;

    const initializeApi = async () => {
      if (!calendarRef.current || !isComponentMounted) return;

      try {
        if (typeof calendarRef.current.getApi === "function") {
          const apiInstance = await calendarRef.current.getApi();

          if (isComponentMounted) {
            setApi(apiInstance);
            setIsReady(true);
          }
          return true;
        }
      } catch (error) {
        // API not ready yet
      }
      return false;
    };

    const pollForApi = async () => {
      if (pollAttempts >= maxAttempts || !isComponentMounted) {
        console.warn("Max attempts reached for API initialization");
        return;
      }

      pollAttempts++;
      const success = await initializeApi();

      if (!success && isComponentMounted) {
        setTimeout(pollForApi, 100);
      }
    };

    initializeApi().then((success) => {
      if (!success && isComponentMounted) {
        const element = calendarRef.current;
        if (element) {
          const handleComponentReady = () => {
            initializeApi();
          };

          element.addEventListener("componentDidLoad", handleComponentReady);

          setTimeout(pollForApi, 100);

          return () => {
            element.removeEventListener(
              "componentDidLoad",
              handleComponentReady
            );
          };
        }
      }
    });

    return () => {
      isComponentMounted = false;
    };
  }, [calendarRef]);

  useEffect(() => {
    if (isReady && api) {
      updateApiState();

      const element = calendarRef.current;
      if (element) {
        const handleApiChange = () => {
          updateApiState();
        };

        const events = [
          "viewChanged",
          "dateChanged",
          "selectionChanged",
          "mhViewChange",
          "mhDateChange",
        ];

        events.forEach((eventName) => {
          element.addEventListener(eventName, handleApiChange);
        });

        const pollInterval = setInterval(updateApiState, 1000);

        return () => {
          events.forEach((eventName) => {
            element.removeEventListener(eventName, handleApiChange);
          });
          clearInterval(pollInterval);
        };
      }
    }
  }, [isReady, api, updateApiState, calendarRef]);

  const calendarApi = {
    ...(api as IMHCalendarUserApi),
    ...apiState,
    // isReady,
    // setView: async (view: string) => {
    //   if (api?.setView) {
    //     await api.setView(view);
    //     updateApiState();
    //   }
    // },
    // setDate: async (date: Date) => {
    //   if (api?.setDate) {
    //     await api.setDate(date);
    //     updateApiState();
    //   }
    // },
  };

  return calendarApi;
};

interface CalendarProps {
  config?: IMHCalendarConfig;
  events?: IMHCalendarEvent[];
}

export const MHCalendar = forwardRef<any, CalendarProps>(
  ({ config, events }, ref) => {
    const validatedConfig = useMemo(() => {
      const configCopy = {
        ...config,
      };

      if (typeof configCopy.eventContent === "function") {
        const originalEventContent = configCopy.eventContent;

        Object.assign(configCopy, {
          eventContent: (eventInformation: IMHCalendarEvent) =>
            renderToStaticMarkup(originalEventContent({ ...eventInformation })),
        });
      }

      return configCopy;
    }, []);

    return (
      <div style={{ width: "100%", height: "100%" }}>
        <MhCalendar ref={ref} config={validatedConfig} events={events} />
      </div>
    );
  }
);
