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

function createData(modifiedTB) {

  let data = modifiedTB;
  if (!data.zTOTBAL) return null;

  return {
    totalBalance: data.zTOTBAL,
    POSBalance: data.zPOSBal,
    NEGBalance: data.zNEGBal,
    SettlementPrice: data.args[1].toString(),
    SettlementDate: data.args[2].toString(),
    DecayRate: data.args[3].toString(),
    MaxRatio: data.args[4].toString(),
    MaxRatioDate: data.args[5].toString(),
    PastSettlementDate: data.zPSDATE.toString(),
    Condition: data.zCONDITION,
    DiscountRate: data.zDVALUE,
    Withdraw: data.zWITHDRAW,
    details: [
      {
        ContractAddress: data.args[8],
        OracleAddress: data.transactionHash,
        Name: data.args[6],
        Acronym: data.args[7],
        DestructionDate: data.args[9].toString(),
        POSAddress: data.zPOSADD,
        NEGAddress: data.zNEGADD,
      },
    ],
  };
}


function Row(props) {
  let row = props;
  console.log(row);
  const [open, setOpen] = React.useState(false);

  if (!row) return null;

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
        <TableCell align="right">{row.row.totalBalance}</TableCell>
        <TableCell align="right">{row.row.POSBalance}</TableCell>
        <TableCell align="right">{row.row.NEGBalance}</TableCell>
        <TableCell align="right">{row.row.SettlementPrice}</TableCell>
        <TableCell align="right">{row.row.SettlementDate}</TableCell>
        <TableCell align="right">{row.row.DecayRate}</TableCell>
        <TableCell align="right">{row.row.MaxRatio}</TableCell>
        <TableCell align="right">{row.row.MaxRatioDate}</TableCell>
        <TableCell align="right">{row.row.PastSettlementDate}</TableCell>
        <TableCell align="right">{row.row.Condition}</TableCell>
        <TableCell align="right">{row.row.DiscountRate}</TableCell>
        <TableCell align="right">{row.row.Withdraw}</TableCell>

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

                    <TableCell > Deposit To POS </TableCell>
                    <TableCell > Deposit To NEG </TableCell>
                    <TableCell > Approve POS </TableCell>
                    <TableCell > Approve NEG </TableCell>

                    <TableCell > Redeem POS</TableCell>
                    <TableCell > Redeem NEG </TableCell>

                    <TableCell > Withdraw POS </TableCell>
                    <TableCell > Withdraw NEG </TableCell>

                    <TableCell > Settle </TableCell>
                    <TableCell >  TurnWithdrawOn </TableCell>
                    <TableCell >  DESTRUCTION </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>

                <TableRow >
                      <TableCell component="th" scope="row">{row.row.details[0].ContractAddress}</TableCell>
                      <TableCell>{row.row.details[0].OracleAddress}</TableCell>
                      <TableCell align="right">{row.row.details[0].Name}</TableCell>
                      <TableCell align="right">{row.row.details[0].Acronym}</TableCell>
                      <TableCell align="right">{row.row.details[0].DestructionDate}</TableCell>
                      <TableCell align="right">{row.row.details[0].POSAddress}</TableCell>
                      <TableCell align="right">{row.row.details[0].NEGAddress}</TableCell>

                  </TableRow>

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
      totalBalance: PropTypes.string,
      POSBalance: PropTypes.string,
      NEGBalance: PropTypes.string,
      SettlementPrice: PropTypes.string,
      SettlementDate: PropTypes.string,
      DecayRate: PropTypes.string,
      MaxRatio: PropTypes.string,
      MaxRatioDate: PropTypes.string,
      PastSettlementDate: PropTypes.string,
      Condition: PropTypes.string,
      DiscountRate: PropTypes.string,
      Withdraw: PropTypes.string,
      details: PropTypes.arrayOf(PropTypes.shape({
          ContractAddress: PropTypes.string,
          OracleAddress: PropTypes.string,
          Name: PropTypes.string,
          Acronym: PropTypes.string,
          DestructionDate: PropTypes.string,
          POSAddress: PropTypes.string,
          NEGAddress: PropTypes.string,
      }))
  }).isRequired,
};


export default function CollapsibleTable(props) {

  let florins = props.rows;
  //console.log(florins);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Total Balance</TableCell>
            <TableCell align="right"> POS Balance </TableCell>
            <TableCell align="right"> NEG Balance </TableCell>
            <TableCell align="right"> Settlement Price </TableCell>
            <TableCell align="right"> Settlement Date </TableCell>
            <TableCell align="right"> Decay Rate </TableCell>
            <TableCell align="right"> Max Ratio </TableCell>
            <TableCell align="right"> Max Ratio Date </TableCell>
            <TableCell align="right"> PastSettlement Date </TableCell>
            <TableCell align="right"> Condition </TableCell>
            <TableCell align="right"> Discount Rate </TableCell>
            <TableCell align="right"> Withdraw </TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
{florins.map((row) => {
   const data = createData(row);
   return data ? <Row key={data.contractAddress} row={data} /> : null;
})}

</TableBody>
      </Table>
    </TableContainer>
  );
}

