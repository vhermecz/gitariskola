import React, {useEffect, useState} from 'react';
import {
    Chip,
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

export function PageChip({book, page}) {
  return (
    <Chip
      style={{margin:1}}
      size="small"
      color="primary"
      label={<React.Fragment><b>{book}</b> {page}</React.Fragment>} />
  )
}

export function ChordChip({chord}) {
  return (
    <Chip
      style={{margin:1}}
      size="small"
      color="primary"
      label={chord} />
  )
}

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
              <TableRow key={row.idx}>
                <TableCell component="th" scope="row">{row.title}</TableCell>
                <TableCell>{row.performer}</TableCell>
                <TableCell>{
                  row.pagerefs.map(pageref => 
                    pageref.pages.map(page => 
                      <PageChip book={pageref.book} page={page} />
                    )
                  )
                }</TableCell>
                <TableCell>{
                  (row.chords[0]||[]).map(chord =>
                    <ChordChip chord={chord} />
                  )
                }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default SongList;
