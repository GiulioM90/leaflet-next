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

const Item = styled(Paper)(({ theme, bgColor, txtColor }) => ({
  backgroundColor: bgColor,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  display: 'flex',
  textAlign: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.text.secondary,
  width: '100px',
  height: '100px',
  fontSize: '22px',
  color: txtColor,
}));

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Home() {
  
  const DEFAULT_CENTER =[40.851775,  14.268124];

  const [data, setData] = useState([]);

   const { data: jsonData } = useSWR(
    'https://giuliogis.developy.it/api/json',
    fetcher
  );

  useEffect(() => {
    setData(jsonData);
  }, [jsonData]);


  let iconUrl = '/leaflet/images/bluehome.png';

  const homes = data?.map((house) => {
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
  console.log(homes)
  
  // TODO: get user location 
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(position => {
  //       const { latitude, longitude } = position.coords;
  //       setInitialPosition([latitude, longitude]);
  
  //   });
  // }, []);

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
                  {homes?.map(({ id, lat, lon, indirizzo, foglio, particella, note }) => {

                    return (
                      <Marker 
                        key={id} 
                        position={[lat, lon]}
                        icon={Leaflet.icon({
                          iconUrl: 'leaflet/images/bluehome.png',
                          iconSize: [41, 41],
                        })}
                      >
                        <Popup>
                          <strong>Indirizzo:</strong> { indirizzo }
                          <br />
                          <strong>Foglio:</strong> { foglio }
                          <br />
                          <strong>Particella:</strong> { particella }
                          <br />
                          <strong>Note:</strong> { note }
                        </Popup>
                      </Marker>
                    )
                  })}
              </>
            )}
          </Map>

          <Stack direction="row" spacing={2} justifyContent={'center'} my={2}>
            <Item bgColor="green" txtColor="white">23</Item>
            <Item bgColor="green" txtColor="white">12</Item>
            <Item bgColor="yellow" txtColor="black">1</Item>
            <Item bgColor="red" txtColor="white">99</Item>
          </Stack>
          <Stack  direction="row" useFlexGap flexWrap="wrap" spacing={2} justifyContent={'center'}>
            {
              homes?.map(({ id, lat, lon, indirizzo, foglio, particella, note }) => {
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
                        {indirizzo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Foglio: {foglio}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Particella: {particella}
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
                        { note }
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
