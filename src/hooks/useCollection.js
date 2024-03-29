import { useState, useEffect } from "react"
import { db } from "../services/firebase"

export default function useCollection(path, orderBy, where = []) {
  const [docs, setDocs] = useState([])

  const [queryField, queryOperator, queryValue] = where

  useEffect(() => {
    let collection = db.collection(path)

    if (orderBy) {
      collection = collection.orderBy(orderBy)
    }

    if (queryField) {
      collection = collection.where(queryField, queryOperator, queryValue)
    }

    return collection.onSnapshot((snapshot) => {
      const docs = []
      snapshot.forEach((doc) => {
        docs.push({
          ...doc.data(),
          id: doc.id,
        })
      })
      setDocs(docs)
    })
  }, [orderBy, path, queryField, queryOperator, queryValue])

  return docs
}
