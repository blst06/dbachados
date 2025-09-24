import SideNav from "../../../components/Layout/SideNav";
import { Box } from "@mui/material";
import NavBar from "../../../components/Layout/NavBar";
import DataBaseTable from "../../../components/DataTable/DatabaseTable";
import { TableProvider } from "../../../context/TableContext";
import { useTheme, Theme } from "@mui/material/styles";

const Table = () => {
  const theme = useTheme();
  return (
    <>
      <NavBar/>
      <Box />
      <Box sx={{ display: 'flex' }}>
        <SideNav />
        <Box component='main' sx={{ flexGrow: 1, height: '100vh', bgcolor: (theme as Theme).palette.background.default }}>
          <TableProvider>
            <DataBaseTable />
          </TableProvider>
        </Box>
      </Box>
    </>
  )
}

export default Table