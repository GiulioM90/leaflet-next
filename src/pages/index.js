import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useSWR from 'swr';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import styles from '@styles/Home.module.scss';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Home() {
  
  const [newData, setNewData] = useState([]);
  const [data, setData] = useState([]);

   const { data: santaData } = useSWR(
    'https://firebasestorage.googleapis.com/v0/b/santa-tracker-firebase.appspot.com/o/route%2Fsanta_en.json?alt=media&2018b',
    fetcher
  );
  const { data: jsonData } = useSWR(
    'https://giuliogis.developy.it/api/json',
    fetcher
  );

  useEffect(() => {
    setData(santaData);
    setNewData(jsonData);
  }, [santaData, jsonData]);
  
  // const currentYear = new Date(Date.now()).getFullYear();
  // const currentDate = new Date(Date.now());
  const currentYear = new Date(1703458800000).getFullYear();
  const currentDate = new Date(1703458800000);
  

  let iconUrl = '/leaflet/images/bluehome.png';
  // let iconRetinaUrl = '/images/tree-marker-icon-2x.png';
  // convert to data this timestamp 1703437200
  const homes = newData?.map((house) => {
    const { id, lat, lon, indirizzo, foglio, particella, note} = house;
    return {
      id,
      lat,
      lon,
      indirizzo,
      foglio,
      particella,
      note,
    }
  })

  const destinations = data?.destinations?.map((destination) => {
    const { arrival, departure } = destination;
  
    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);
       
    arrivalDate.setFullYear(currentYear);
    departureDate.setFullYear(currentYear);
  
    return {
      ...destination,
      arrival: arrivalDate.getTime(),
      departure:  departureDate.getTime(),
    }
  });

  console.log(data)
  console.log(newData)
  const [DEFAULT_CENTER, setInitialPosition] = useState([41.3549,  14.3705]);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setInitialPosition([latitude, longitude]);
  
    });
  }, []);

  return (
    <Layout>
      <Head>
        <title>Censimento immobili</title>
        <meta name="description" content="Create mapping apps" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <h1 className={styles.title}>
            Mappa
          </h1>
          <Map className={styles.homeMap} width="800" height="400" center={DEFAULT_CENTER} zoom={12}>
              {({ TileLayer, Marker, Popup }, Leaflet) => (
              <>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  // attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                  {destinations?.map(({ id, arrival, departure, location, city, region }) => {

                    const arrivalDate = new Date(arrival);
                    const arrivalHours = arrivalDate.getHours()
                    const arrivalMinutes = arrivalDate.getMinutes()
                    const arrivalTime = `${arrivalHours}:${arrivalMinutes}`;

                    const departureDate = new Date(departure);
                    const departureHours = departureDate.getHours()
                    const departureMinutes = departureDate.getMinutes()
                    const departureTime = `${departureHours}:${departureMinutes}`;

                    const payedRent = currentDate.getTime() - departureDate.getTime() > 0;
                    const noPayedRent = currentDate.getTime() - arrivalDate.getTime() > 0 && !payedRent;
                    return (
                      <Marker 
                        key={id} 
                        position={[location.lat, location.lng]}
                        icon={Leaflet.icon({
                          iconUrl: 'leaflet/images/bluehome.png',
                          // iconUrl: payedRent ? '/leaflet/images/green_arrow_up.png' : '/leaflet/images/red_arrow_down.png',
                          iconSize: [41, 41],
                        })}
                      >
                        <Popup>
                          <img src={payedRent ? "leaflet/images/green_arrow_up.png" : "leaflet/images/red_arrow_down.jpg"} alt="green_arrow_up" width="50" height="60" />
                          <strong>Location:</strong> { city }, { region }
                          <br />
                          <strong>Arrival:</strong> { arrivalDate.toDateString() } @ { arrivalTime }
                          <br />
                          <strong>Departure:</strong> { arrivalDate.toDateString() } @ { departureTime }
                        </Popup>
                      </Marker>
                    )
                  })}
              </>
            )}
          </Map>

          <Stack direction="row" spacing={2} justifyContent={'center'}>
            <Item>23</Item>
            <Item>12</Item>
            <Item>1</Item>
            <Item>99</Item>
          </Stack>
          <Stack  direction="row" useFlexGap flexWrap="wrap" spacing={2} justifyContent={'center'}>
            {
              destinations?.map(({ id, arrival, departure, location, city, region }) => {
                return (
                  <Card sx={{ maxWidth: 245 }} key={id}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image="/housepic.png"
                      alt="foto abitazione"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {city}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Foglio: {arrival}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Particella: {region}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <>
                  <Card variant="outlined"  sx={{ margin: '30px' }}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                         NOTES
                      </Typography>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        NOTE NON DISPONIBILI
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">EDIT</Button>
                    </CardActions>
                  </Card>
                  </>
                </Card>
                )
              })
            }
          </Stack>
        </Container>
      </Section>
    </Layout>
  )
}
