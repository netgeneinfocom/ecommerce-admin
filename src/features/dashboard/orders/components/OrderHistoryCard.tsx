// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Clock } from "lucide-react";
// import type { OrderHistoryEvent } from "../types";

// interface OrderHistoryCardProps {
//   history: OrderHistoryEvent[];
// }

// export function OrderHistoryCard({ history }: OrderHistoryCardProps) {
//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <CardTitle className="text-base flex items-center gap-2">
//           <Clock className="h-4 w-4 text-primary" />
//           Order History
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {history.map((event, index) => (
//             <div key={event.id} className="flex gap-4">
//               <div className="flex flex-col items-center">
//                 <div className="h-2 w-2 rounded-full bg-primary" />
//                 {index < history.length - 1 && <div className="w-px h-full bg-border mt-2" />}
//               </div>
//               <div className="flex-1 pb-4">
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium text-sm">{event.status}</span>
//                   <span className="text-xs text-muted-foreground">{event.timestamp}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
