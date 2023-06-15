"use client";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Button, { ButtonStyle } from "../../_components/button";
import CustomLink, { LinkStyle } from "../../_components/link";
import { customAlert } from "../../_components/alert";

export default function Prediction() {
  const [pageNumbers, setPageNumbers] = useState([]);
  const [images, setImages] = useState([]);
  const [predictions, setPredications] = useState([]);
  const [paginationImages, setPaginationImages] = useState([]);
  const [paginationPredictions, setPaginationPredications] = useState([]);
  const [page, setPage] = useState(1);
  const [currentUrl, setCurrentUrl] = useState("");
  const display = 12;

  // Change the current page.
  const pagination = (pageNumber = 1) => {
    window.location.hash = pageNumber + "";
    setPredications(
      paginationPredictions.slice(
        (pageNumber - 1) * display,
        pageNumber * display
      )
    );
    setImages(
      paginationImages.slice((pageNumber - 1) * display, pageNumber * display)
    );
    setPage(pageNumber);
    setCurrentUrl(window.location.hash);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    (async () => {
      let results: AxiosResponse;
      try {
        results = await axios.get(
          process.env.NEXT_PUBLIC_API + "/api/v1/user/getImagesAndPredictions",
          {
            withCredentials: true,
          }
        );
      } catch (e) {
        customAlert(e.message);
        return;
      }

      if (!results.data?.data.images) {
        return;
      }

      setPaginationPredications(results.data.data.predictions);
      setPaginationImages(results.data.data.images);
    })();
  }, []);

  useEffect(() => {
    if (paginationImages && paginationPredictions) {
      const pageHash = window.location.hash.slice(1);
      if (pageHash) {
        pagination(parseInt(window.location.hash.slice(1)));
      } else {
        pagination();
      }
      setPageNumbers(
        Array.from(
          { length: Math.ceil(paginationImages.length / display) },
          (_, i) => i
        )
      );
    }
  }, [paginationImages, paginationPredictions]);

  if (!images.length) {
    return (
      <div className="predictions__no-images">
        <h1>You have no past prediction.</h1>
      </div>
    );
  }

  if (pageNumbers.length === 1) {
    return (
      <section className="predictions__container">
        {images.map((imageUrl, i) => {
          return (
            <figure key={i} className="predictions__figure">
              <img
                src={`${process.env.NEXT_PUBLIC_API}/api/v1/model/images/${imageUrl}`}
              />
              <figcaption>
                <span>{predictions[i].predictions[0]} </span>
                <span>{predictions[i].predictions[1]}</span>
              </figcaption>
            </figure>
          );
        })}
      </section>
    );
  }

  return (
    <>
      <section className="predictions__container">
        {images.map((imageUrl, i) => {
          return (
            <figure key={i} className="predictions__figure">
              <img
                src={`${process.env.NEXT_PUBLIC_API}/api/v1/model/images/${imageUrl}`}
              />
              <figcaption>
                <span>{predictions[i].predictions[0]} </span>
                <span>{predictions[i].predictions[1]}</span>
              </figcaption>
            </figure>
          );
        })}
      </section>

      <div className="predictions__pagination">
        <div className="predictions__buttons">
          <Button
            style={ButtonStyle.back}
            disabled={page - 1 === 0}
            onClick={() => pagination(page - 1)}
          >
            Page {page - 1 + ""}
          </Button>
        </div>

        <div className="predictions__pages">
          {pageNumbers
            .filter((value) => Math.abs(value - page + 1) <= 2)
            .map((pageNumber, i) => {
              return (
                <CustomLink
                  key={i}
                  href={`#${pageNumber + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    pagination(pageNumber + 1);
                  }}
                  type={LinkStyle.underline}
                  url={currentUrl}
                >
                  {pageNumber + 1}
                </CustomLink>
              );
            })}
        </div>
        <div className="predictions__buttons">
          <Button
            style={ButtonStyle.next}
            disabled={page * display + 1 > paginationImages.length}
            onClick={() => pagination(page + 1)}
          >
            Page {page + 1 + ""}
          </Button>
        </div>
      </div>
    </>
  );
}
