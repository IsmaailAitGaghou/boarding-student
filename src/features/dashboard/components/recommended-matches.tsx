import {
   Card,
   Box,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   Chip,
   Avatar,
   Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { tokens } from "@/app/theme";


type Match = {
   id: string;
   companyName: string;
   position: string;
   matchPercentage: number;
   location: string;
   logo?: string;
};

type RecommendedMatchesProps = {
   matches: Match[];
};

export function RecommendedMatches({ matches }: RecommendedMatchesProps) {
    const navigate = useNavigate();
   if (!matches || matches.length === 0) {
      return null;
   }

   return (
      <Card
         sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${tokens.color.border}`,
         }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
         <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Recommended Matches
         </Typography>
         <Button
            size="small"
            endIcon={<ArrowForwardIcon />}
            onClick={
                () => {
                    navigate("/matching");
                }
            }
            sx={{
               p: 2,
               borderColor: tokens.color.border,
               color: tokens.color.text.primary,
               "&:hover": {
                  borderColor: tokens.color.primary[700],
                  backgroundColor: tokens.color.primary[300] + "10",
               },
            }}
         >
            View All
         </Button>
         </Box>
         <TableContainer>
            <Table>
               <TableHead sx={{ backgroundColor: tokens.color.background }}>
                  <TableRow>
                     <TableCell
                        sx={{ fontWeight: 600, color: tokens.color.text.muted }}
                     >
                        Company
                     </TableCell>
                     <TableCell
                        sx={{ fontWeight: 600, color: tokens.color.text.muted }}
                     >
                        Position
                     </TableCell>
                     <TableCell
                        sx={{ fontWeight: 600, color: tokens.color.text.muted }}
                     >
                        Match
                     </TableCell>
                     <TableCell
                        sx={{ fontWeight: 600, color: tokens.color.text.muted }}
                     >
                        Location
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {matches.map((match) => (
                     <TableRow
                        key={match.id}
                        sx={{
                           "&:last-child td, &:last-child th": { border: 0 },
                           "&:hover": {
                              backgroundColor: tokens.color.background,
                              cursor: "pointer",
                           },
                        }}
                     >
                        <TableCell>
                           <Box
                              sx={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 2,
                              }}
                           >
                              <Avatar
                                 src={match.logo}
                                 alt={match.companyName}
                                 sx={{ width: 32, height: 32 }}
                              >
                                 {match.companyName.charAt(0)}
                              </Avatar>
                              <Typography
                                 variant="body2"
                                 sx={{ fontWeight: 500 }}
                              >
                                 {match.companyName}
                              </Typography>
                           </Box>
                        </TableCell>
                        <TableCell>
                           <Typography variant="body2">
                              {match.position}
                           </Typography>
                        </TableCell>
                        <TableCell>
                           <Chip
                              label={`${match.matchPercentage}%`}
                              size="small"
                              sx={{
                                 backgroundColor:
                                    match.matchPercentage >= 80
                                       ? tokens.color.success + "20"
                                       : match.matchPercentage >= 60
                                       ? tokens.color.primary[300]
                                       : tokens.color.warning + "20",
                                 color:
                                    match.matchPercentage >= 80
                                       ? tokens.color.success
                                       : match.matchPercentage >= 60
                                       ? tokens.color.primary[700]
                                       : tokens.color.warning,
                                 fontWeight: 600,
                              }}
                           />
                        </TableCell>
                        <TableCell>
                           <Typography variant="body2" color="text.secondary">
                              {match.location}
                           </Typography>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Card>
   );
}
