import { useState, useEffect, useLayoutEffect } from "react";
import { Card, TextContainer, Text, VerticalStack, Grid, Button } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { LineChart } from "./LineChart";
import Lottie from 'react-lottie-player';
import Loader from '../animation/loader.json';
import { use } from "i18next";
import { generateUserforScript, getUserDataById } from "../utils/api/index";
import { parentChart, contentStyle, labelStyle, labelContent, containerStyle, scriptStyle, innerContent } from "../../frontend/utils/styles/index";
// Assuming you have included Shopify App Bridge library


/* The above code is a JavaScript React component that fetches data asynchronously and updates the
component's state accordingly. It fetches store details, user data, and analytics data from various
API endpoints. It also includes functions to add scripts to a Shopify store and handle the creation
of products. The component renders different content based on the fetched data and state values. */
export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();
  const productsCount = 5;

  const [analyticsData, setAnalyticsData] = useState(null)
  const [userName, setUserName] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lablesAndData, setLabelsAndData] = useState({
    labels: [],
    data: [],
  });
  const [noDataState, setNodataState] = useState(false)

  /* The above code is using the `useLayoutEffect` hook in a React component. It is fetching data
  asynchronously and updating the component's state accordingly. */
  const fetchData = async () => {
  
    const storeDetailData = await getStoreDetail();
    if (storeDetailData) {

      const userExist = await getUserDataById(storeDetailData.id, setNodataState, setAnalyticsData);

      if (userExist === 404) { //user exist
        const generateUserScript = await generateUserforScript(storeDetailData);
        if (generateUserScript) {
          //get script id
          const getUserScript = await getUserDataById(generateUserScript.shop_id, setNodataState, setAnalyticsData);
        }
        else {
          setToastProps({
            content: t("ProductsCard.errorWithUserDataToast"),
             error: true,
             });
        }
        setLoading(false);
      }
      else {
        setLoading(false)
      }
    }
    else {
      setLoading(false);
      setToastProps({
        content: t("ProductsCard.errorWithUserDataToast"),
         error: true,
         });
    }
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  /* The above code is using the useEffect hook in React to update the state of labels and data based on
  the analyticsData. */
  useEffect(() => {
    if (analyticsData) {
      setLabelsAndData({
        labels: [
          ...Object.keys(analyticsData.inappBrowserVisitsWeekly).map((i) => i
          ),
        ],
        data: [
          ...Object.keys(analyticsData.inappBrowserVisitsWeekly).map(
            (i) => analyticsData.inappBrowserVisitsWeekly[i]
          ),
        ],
      });
    }
  }, [analyticsData]);


  /**
   * The function `getStoreDetail` is an asynchronous function that makes a GET request to the
   * `/api/store_details` endpoint, retrieves the data, sets the store details and username, and
   * returns the shop data.
   * @returns The function `getStoreDetail` returns the `data.data.shop` object if the response status
   * is 200.
   */

  const getStoreDetail = async () => {
    try {
      const res = await fetch('/api/store_details', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        setUserName(data.data.shop.shop_owner.split(' ')[0])
        return data.data.shop;
      }
    }
    catch (e) {
      console.log(e);
      return;
    }

  }




  /**
   * The function `addScript` makes a POST request to a specified API endpoint to add a script tag with
   * a given source URL.
   */


  const addScriptLoader = async () => {
    try {
      const res = await fetch("/api/script_tags_loader", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          src: `https://scripts.openinapp.com/loader/4ee88f85-ac60-44ad-9737-3fd6da32b3a7.js`,
        }),
      });

    } catch (error) {
      console.log(error);
    }
  }





  /**
   * The function `handlePopulate` sends a request to create products and updates the toast message based
   * on the response.
   */
  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/create");

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("ProductsCard.productsCreatedToast", {
          count: productsCount,
        }),
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: t("ProductsCard.errorCreatingProductsToast"),
        error: true,
      });
    }
  };
  /* The code is using the `useAppQuery` hook to fetch data from the "/api/products/count" endpoint. It
  is destructuring the returned values from the hook into `data`, `refetchProductCount`,
  `isLoadingCount`, and `isRefetchingCount`. */

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  /* The code is creating a `toastMarkup` variable that conditionally renders a `Toast` component based
  on the values of `toastProps.content` and `isRefetchingCount`. */
  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );


  /* The code block is displaying a loading animation while the `loading` state is true. It creates a
  centered div with a Lottie animation component that plays the specified animation. This is a visual
  indicator to the user that the data is being loaded. */

  if (loading) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Lottie
          loop
          animationData={Loader}
          play
          style={{ width: 100, height: 100 }}
        />
      </div>
    )
  }

  /* The above code is a JavaScript React component. It checks if the `noDataState` variable is true. If
  it is true, it renders a div with some text and a heading, indicating that there is no data yet. The
  div is styled with padding and a minimum height. */
  if (noDataState) {
    return (
      <div style={{ padding: "1rem" }}>
        <Text variant="heading2xl" as="h3">
          Hello, {userName}
        </Text>
        <div style={{ marginTop: "6px", marginBottom: "26px" }}>
          <Text>Please wait for us to redirect your first few customers!</Text>
        </div>
        <div style={{
          display: "grid",
          placeContent: "center",
          gap: "32px",
          minHeight: "calc(100vh - 150px)",

        }}>

          <Text alignment="center" color="subdued" variant="headingXl" as="h1">No Data Yet!</Text>
        </div>
      </div>
    )
  }
  return (
    <>

      {/* {showAddScript ? <div style={scriptStyle}>
        <Card sectioned>
          <div style={innerContent}>
            <div style={{ marginTop: "32px" }}>
              <Text variant="headingXl" as="h1">OpeninApp for Stores</Text>
            </div>
            <div style={{ marginTop: "16px", marginBottom: "32px" }}> <Text variant="bodyMd" >Increase you store performace and conversions<br />
              with the power of Smartlinks</Text></div>

            <Button onClick={toAddScript} primary>
              Enable OpenInApp
            </Button>
          </div>
        </Card>

      </div> : 
       */}
      {
        analyticsData && !noDataState && <div style={containerStyle}>
          {toastMarkup}

          <Text variant="heading2xl" as="h3">
            Hello, {userName}
          </Text>
          <div style={{ marginTop: "6px", marginBottom: "26px" }}>
            <Text>Here is your Store Performace</Text>
          </div>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }} >
              <Card sectioned className="card_content">
                <div style={contentStyle}>
                  <Text variant="bodyMd" as="h5">In-App Browser Visits</Text>
                </div>
                <Text variant="headingXl" as="h4">{analyticsData?.totalInappBrowserVisits}</Text>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
              <Card sectioned >
                <div style={contentStyle} >
                  <Text variant="bodyMd" as="h5">Successful OpeninApp Redirections</Text>
                </div>
                <Text variant="headingXl" as="h4">{analyticsData?.totalRedirections}</Text>
              </Card>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
              <Card sectioned  >
                <div style={contentStyle}>
                  <Text variant="bodyMd" as="h5">Avg Redirection Speed</Text>
                </div>
                <Text variant="headingXl" as="h4">{analyticsData?.averageRedirectionSpeed} ms</Text>
              </Card>
            </Grid.Cell>
          </Grid>

          <div style={parentChart}>
            <div style={labelStyle}>
              <div style={labelContent}></div><Text variant="headingSm" >In-App Browser Visits</Text>
            </div>

            <LineChart lablesAndData={lablesAndData} />

          </div>

        </div>}

    </>
  );
}
