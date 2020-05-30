import React, {useEffect, useState} from 'react';
import {
    TableContainer,
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    Paper
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {CHORDINFO} from "../config/chordinfo";

const useStyles = makeStyles(theme => ({
  content: {
    minWidth: 650,
    maxWidth: 1200,
  },
}));

export function SongList() {
  const classes = useStyles();
  const chords = CHORDINFO;
  return (
    <div className={classes.content}>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="running">
          <TableHead>
            <TableRow>
              <TableCell>Dal neve</TableCell>
              <TableCell>Előadó</TableCell>
              <TableCell>Könyv</TableCell>
              <TableCell>Akkord</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chords.map(row => (
              <TableRow key={row.title+row.chords}>
                <TableCell component="th" scope="row">{row.title}</TableCell>
                <TableCell>{row.performer}</TableCell>
                <TableCell>{row.pages}</TableCell>
                <TableCell>{row.chords}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default SongList;
