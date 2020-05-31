import React, {useEffect, useState} from 'react';
import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
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
    marginRight: "auto",
    marginLeft: "auto",
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

function filterByChords(songs, chordsFilter, chordFilterMode) {
  if (!chordsFilter.length) {
    return songs;
  }
  return songs.filter(song => {
    const songChords = lodash.flattenDeep(song.chords);
    const common = songChords.filter(chord => chordsFilter.includes(chord))
    const others = songChords.filter(chord => !chordsFilter.includes(chord))
    return common.length === chordsFilter.length && others.length <= chordFilterMode;
  });
}

function getUniqChords(songs) {
  const chords = lodash.flattenDeep(songs.map(song => song.chords));
  const chordsUniq = lodash.uniq(chords);
  chordsUniq.sort();
  return chordsUniq;
}

const ANY_OTHER_CHORD = 1000;
const CHORD_FILTER_MODES = [
  {
    label: "Más akkordok is",
    limit: ANY_OTHER_CHORD,
  },
  {
    label: "Csak ezek",
    limit: 0,
  },
  {
    label: "Max 1 másik",
    limit: 1,
  },
  {
    label: "Max 2 másik",
    limit: 2,
  },
  {
    label: "Max 3 másik",
    limit: 3,
  },
]

export function SongList() {
  const classes = useStyles();
  const [textFilter, setTextFilter] = useState("");
  const [booksFilter, setBooksFilter] = useState([]);
  const [chordsFilter, setChordsFilter] = useState([]);
  const [chordFilterMode, setChordFilterMode] = useState(ANY_OTHER_CHORD);
  const uniqBooks = getUniqBooks(CHORDINFO);
  const uniqChords = getUniqChords(CHORDINFO);
  const songs = filterByChords(filterByBook(filterByText(CHORDINFO, textFilter), booksFilter), chordsFilter, chordFilterMode);
  return (
    <div className={classes.content}>
      <Box my={1}>
        <Paper>
          <Box p={1}>
            Csalamádé dalkereső. A szűrők segítségével kereshetsz dalcímre, előadóra, könyvre vagy akkordokra. <a href="http://www.musztydobay.hu/osszesnota.html">[Forrás]</a>
          </Box>
        </Paper>
      </Box>
      <Box mb={1}>
        <Paper>
          <TextField
            label="Előadó/cím"
            size="small"
            variant="outlined"
            style={{ margin: 4 }}
            value={textFilter}
            onChange={(event) => setTextFilter(event.target.value)}/>
          <Autocomplete
            multiple
            size="small"
            options={uniqBooks}
            style={{ width: 300, display: 'inline-flex', margin: 4 }}
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
          <Autocomplete
            multiple
            size="small"
            options={uniqChords}
            style={{ width: 400, display: 'inline-flex', margin: 4 }}
            getOptionLabel={(option) => option}
            value={chordsFilter}
            onChange={(event,value,c) => setChordsFilter(value)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Akkordok"
              />
            )}
          />
          <FormControl
              variant="outlined"
              style={{ width: 200, margin: 4 }}
              margin="dense">
            <InputLabel id="chord-mode-select-label">Akkord mód</InputLabel>
            <Select
              labelId="chord-mode-select-label"
              id="chord-mode-select"
              value={chordFilterMode}
              onChange={(event) => setChordFilterMode(event.target.value)}
              label="Akkord mód"
            >
              {
                CHORD_FILTER_MODES.map(mode =>
                  <MenuItem value={mode.limit}>{mode.label}</MenuItem>
                )
              }
            </Select>
          </FormControl>  
        </Paper>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="running">
          <TableHead>
            <TableRow>
              <TableCell><b>Dal neve</b></TableCell>
              <TableCell><b>Előadó</b></TableCell>
              <TableCell><b>Könyv</b></TableCell>
              <TableCell><b>Akkord</b></TableCell>
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
      <Box my={1}>
        <Paper>
          <Box p={1} style={{ textAlign: "right", fontSize: "x-small" }}>
            Készítette: vhermecz, 2020
          </Box>
        </Paper>
      </Box>
    </div>
  )
}

export default SongList;
