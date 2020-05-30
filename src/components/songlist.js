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
import { Autocomplete } from '@material-ui/lab';
import {makeStyles} from "@material-ui/core/styles";
import {CHORDINFO} from "../config/chordinfo";
import lodash from "lodash";

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

function filterByBook(songs, booksFilter) {
  if (!booksFilter.length) {
    return songs;
  }
  return songs.filter(song =>
    song.pagerefs.filter(pageref => booksFilter.includes(pageref.book)).length
  )
}

function getUniqBooks(songs) {
  const books = lodash.flatten(
    songs.map(song =>
      song.pagerefs.map(pageref =>
        pageref.book
  )))
  const booksUniq = lodash.uniq(books);
  booksUniq.sort();
  return booksUniq;
}

export function SongList() {
  const classes = useStyles();
  const [textFilter, setTextFilter] = useState("");
  const [booksFilter, setBooksFilter] = useState([]);
  const uniqBooks = getUniqBooks(CHORDINFO);
  const songs = filterByBook(filterByText(CHORDINFO, textFilter), booksFilter);
  return (
    <div className={classes.content}>
      <TextField
        label="Előadó/cím"
        value={textFilter}
        onChange={(event) => setTextFilter(event.target.value)}/>
      <Autocomplete
        multiple
        options={uniqBooks}
        style={{ width: 200 }}
        getOptionLabel={(option) => option}
        value={booksFilter}
        onChange={(event,value,c) => setBooksFilter(value)}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Könyvek"
          />
        )}
      />        
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
