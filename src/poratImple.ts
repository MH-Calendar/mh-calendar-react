// const [portalTargets, setPortalTargets] = useState<PortalTarget[]>([]);
// const scanTimeoutRef = useRef<any>(null);
// const isScanning = useRef(false);
// const lastScanTime = useRef(0);
// const renderedPortalsRef = useRef<Set<string>>(new Set());

// // Sprawdź czy element nadal istnieje w DOM
// const isElementInDOM = (element: HTMLElement): boolean => {
//   return document.contains(element);
// };

// // Wyczyść portale które nie powinny już istnieć
// const cleanupStalePortals = useCallback(() => {
//   const currentEventIds = new Set(config.events?.map((e: any) => e.id) || []);
  
//   setPortalTargets(prev => {
//     const validPortals = prev.filter(({ eventId, element, elementId }) => {
//       // Sprawdź czy event nadal istnieje
//       if (!currentEventIds.has(eventId)) {
//         renderedPortalsRef.current.delete(elementId);
//         return false;
//       }
      
//       // Sprawdź czy element nadal istnieje w DOM
//       if (!isElementInDOM(element)) {
//         renderedPortalsRef.current.delete(elementId);
//         return false;
//       }
      
//       return true;
//     });
    
//     return validPortals;
//   });
// }, [config.events]);

// // Główna funkcja skanowania portali
// const scanForPortals = useCallback(() => {
//   if (isScanning.current) return;
  
//   const now = Date.now();
//   // Minimalne opóźnienie między skanowaniami
//   if (now - lastScanTime.current < 50) return;
  
//   isScanning.current = true;
//   lastScanTime.current = now;

//   try {
//     // Najpierw wyczyść stare portale
//     cleanupStalePortals();

//     const currentEventIds = new Set(config.events?.map((e: any) => e.id) || []);
//     const newPortals: PortalTarget[] = [];
//     const processedElements = new Set<string>();

//     config.events?.forEach((event: any) => {
//       const portalElements = document.querySelectorAll(`[id^="portal-${event.id}-"]`);
      
//       Array.from(portalElements).forEach((el) => {
//         const element = el as HTMLElement;
//         const elementId = element.id;
        
//         // Sprawdź czy element już został przetworzony w tej iteracji
//         if (processedElements.has(elementId)) return;
//         processedElements.add(elementId);
        
//         // Sprawdź czy element nadal istnieje w DOM
//         if (!isElementInDOM(element)) return;
        
//         // Sprawdź czy portal już istnieje dla tego elementu
//         const existingPortal = portalTargets.find(p => p.elementId === elementId);
//         if (existingPortal && existingPortal.eventId === event.id) return;
        
//         // Sprawdź czy element potrzebuje renderowania
//         const needsRendering = (
//           element.children.length === 0 || 
//           !renderedPortalsRef.current.has(elementId)
//         );

//         if (needsRendering) {
//           const key = `${event.id}-${elementId}-${now}`;
//           newPortals.push({ 
//             eventId: event.id, 
//             element,
//             elementId,
//             key
//           });
//           renderedPortalsRef.current.add(elementId);
//         }
//       });
//     });

//     if (newPortals.length > 0) {
//       setPortalTargets(prev => {
//         // Usuń stare portale dla tych samych elementów
//         const filteredPrev = prev.filter(prevPortal => 
//           !newPortals.some(newPortal => 
//             newPortal.elementId === prevPortal.elementId
//           )
//         );
        
//         return [...filteredPrev, ...newPortals];
//       });
//     }
//   } catch (error) {
//     console.error('Error scanning for portals:', error);
//   } finally {
//     isScanning.current = false;
//   }
// }, [config.events, portalTargets, cleanupStalePortals]);

// // Debounced scan z pojedynczym timeoutem
// const debouncedScan = useCallback(() => {
//   if (scanTimeoutRef.current) {
//     clearTimeout(scanTimeoutRef.current);
//   }
  
//   scanTimeoutRef.current = setTimeout(() => {
//     scanForPortals();
//     scanTimeoutRef.current = null;
//   }, 100);
// }, [scanForPortals]);

// // Natychmiastowe skanowanie (dla przypadków gdy potrzebujemy szybkiej reakcji)
// const immediateScan = useCallback(() => {
//   if (scanTimeoutRef.current) {
//     clearTimeout(scanTimeoutRef.current);
//     scanTimeoutRef.current = null;
//   }
//   scanForPortals();
// }, [scanForPortals]);

// return (
//   <div style={{ width: "100%", height: "100%" }}>
//     <MhCalendar config={config} />
//     {portalTargets.map(({ eventId, element, elementId, key }) => {
//       const event = config.events?.find((e: any) => e.id === eventId);
      
//       // Walidacja
//       if (!event || !element || !isElementInDOM(element)) {
//         return null;
//       }

//       // Sprawdź czy element nie jest już zajęty przez inny portal
//       const existingPortal = element.querySelector('[data-portal-rendered="true"]');
//       if (existingPortal && existingPortal !== element) {
//         return null;
//       }

//       // Oznacz element jako zajęty
//       element.setAttribute('data-portal-rendered', 'true');
//       element.setAttribute('data-portal-event-id', eventId);

//       return ReactDOM.createPortal(
//         <div key={key} data-portal-wrapper="true">
//           {config.eventContent(event)}
//         </div>,
//         element,
//         key
//       );
//     })}
//   </div>
// );