import React, {useEffect, useState} from 'react';
import {
    Chip,
    TableContainer,
    Table,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    TextField,
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

function filterByText(songs, filterText) {
  if (!filterText) {
    return songs;
  }
  const normalizedFilterText = filterText.toLowerCase();
  return songs.filter(song =>
    (song.performer||"").toLowerCase().includes(filterText) ||
    (song.title||"").toLowerCase().includes(filterText)
  )
}

export function SongList() {
  const classes = useStyles();
  const [textFilter, setTextFilter] = useState("");
  const songs = filterByText(CHORDINFO, textFilter);
  return (
    <div className={classes.content}>
      <TextField
        label="Előadó/cím"
        value={textFilter}
        onChange={(event) => setTextFilter(event.target.value)}/>
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
            {songs.map(row => (
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
