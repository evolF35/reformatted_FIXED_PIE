import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {ethers} from 'ethers'


/*function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}*/

function createData(modifiedTB) {

  console.log(modifiedTB);

  return {
    totalBalance: modifiedTB.zTOTBAL,
    POSBalance: modifiedTB.zPOSBal,
    NEGBalance: modifiedTB.zNEGBal,
    SettlementPrice: modifiedTB.args[1],
    SettlementDate: modifiedTB.args[2],
    DecayRate: modifiedTB.args[3],
    MaxRatio: modifiedTB.args[4],
    MaxRatioDate: modifiedTB.args[5],
    PastSettlementDate: modifiedTB.zPSDATE,
    Condition: modifiedTB.zCONDITION,
    DiscountRate: modifiedTB.zDVALUE,
    Withdraw: modifiedTB.zWITHDRAW,
    details: [
      {
        ContractAddress: modifiedTB.args[8],
        OracleAddress: modifiedTB.transactionHash,
        Name: modifiedTB.args[6],
        Acronym: modifiedTB.args[7],
        DestructionDate: modifiedTB.args[9],
        POSAddress: modifiedTB.zPOSADD,
        NEGAddress: modifiedTB.zNEGADD,
      },
    ],
  };
}




function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  if (!row.totalBalance) return null;

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.totalBalance}
        </TableCell>
        <TableCell align="right">{row.totalBalance}</TableCell>
        <TableCell align="right">{row.POSBalance}</TableCell>
        <TableCell align="right">{row.NEGBalance}</TableCell>
        <TableCell align="right">{row.SettlementPrice}</TableCell>
        <TableCell align="right">{row.SettlementDate}</TableCell>
        <TableCell align="right">{row.DecayRate}</TableCell>
        <TableCell align="right">{row.MaxRatio}</TableCell>
        <TableCell align="right">{row.MaxRatioDate}</TableCell>
        <TableCell align="right">{row.PastSettlementDate}</TableCell>
        <TableCell align="right">{row.Condition}</TableCell>
        <TableCell align="right">{row.DiscountRate}</TableCell>
        <TableCell align="right">{row.Withdraw}</TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Pool Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Contract Address</TableCell>
                    <TableCell>Oracle Address</TableCell>
                    <TableCell >Name</TableCell>
                    <TableCell > Acronym </TableCell>
                    <TableCell > DestructionDate </TableCell>
                    <TableCell > POS Address </TableCell>
                    <TableCell > NEG Address </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((historyRow) => (
                    <TableRow key={historyRow.ContractAddress}>
                      <TableCell component="th" scope="row">
                        {historyRow.ContractAddress}
                      </TableCell>
                      <TableCell>{historyRow.OracleAddress}</TableCell>
                      <TableCell align="right">{historyRow.Name}</TableCell>
                      <TableCell align="right">{historyRow.Acronym}</TableCell>
                      <TableCell align="right">{historyRow.DestructionDate}</TableCell>
                      <TableCell align="right">{historyRow.POSAddress}</TableCell>
                      <TableCell align="right">{historyRow.NEGAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    totalBalance: PropTypes.number.isRequired,
    POSBalance: PropTypes.number.isRequired,
    NEGBalance: PropTypes.number.isRequired,
    SettlementPrice: PropTypes.number.isRequired,
    SettlementDate: PropTypes.number.isRequired,
    DecayRate: PropTypes.number.isRequired,
    MaxRatio: PropTypes.number.isRequired,
    MaxRatioDate: PropTypes.number.isRequired,
    PastSettlementDate: PropTypes.bool.isRequired,
    Condition: PropTypes.bool.isRequired,
    DiscountRate: PropTypes.number.isRequired,
    Withdraw: PropTypes.bool.isRequired,
    details: PropTypes.arrayOf(
      PropTypes.shape({
        ContractAddress: PropTypes.string.isRequired,
        OracleAddress: PropTypes.string.isRequired,
        Name: PropTypes.string.isRequired,
        Acronym: PropTypes.string.isRequired,
        DestructionDate: PropTypes.number.isRequired,
        POSAddress: PropTypes.string.isRequired,
        NEGAddress: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default function CollapsibleTable(props) {

  const { rows } = props;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.contractAddress} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
