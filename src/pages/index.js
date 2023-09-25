import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useSWR from 'swr';

import Layout from '@components/Layout';
import Section from '@components/Section';
import Container from '@components/Container';
import Map from '@components/Map';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';


export default function Home() {
  
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data } = useSWR(
    'https://firebasestorage.googleapis.com/v0/b/santa-tracker-firebase.appspot.com/o/route%2Fsanta_en.json?alt=media&2018b',
    fetcher
  );
  
  // const currentYear = new Date(Date.now()).getFullYear();
  // const currentDate = new Date(Date.now());
  const currentYear = new Date(1703458800000).getFullYear();
  const currentDate = new Date(1703458800000);
  

  let iconUrl = '/leaflet/images/bluehome.png';
  // let iconRetinaUrl = '/images/tree-marker-icon-2x.png';
  // convert to data this timestamp 1703437200
  

  const destinations = data?.destinations.map((destination) => {
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
  const [DEFAULT_CENTER, setInitialPosition] = useState([38.907132, -77.036546]);
  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setInitialPosition([latitude, longitude]);
  
    });
  }, []);

  return (
    <Layout>
      <Head>
        <title>Insert your home</title>
        <meta name="description" content="Create mapping apps" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Section>
        <Container>
          <h1 className={styles.title}>
            Tracker
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

          <p className={styles.view}>
            <Button href="#">Marco S. persona pessima</Button>
          </p>
        </Container>
      </Section>
    </Layout>
  )
}
