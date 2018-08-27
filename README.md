# logistics-api

Logistics company wants to put packages from customer's warehouse onto trucks.
The only way to measure the packages is their mass in kilograms (maximum 500), being a natural number.
Truck's maximum load is 1000 kg.
Make an app that will say how many trucks are needed to move client's cargo (try to use as few as possible) and calculate the price.

Tasks:
Make a public HTTP API who will get a request with body like:
```
[
  { "id": "ID-1", "weight": 345 },
  { "id": "OTHER-ID-2", "weight": 500 },
  { "id": "CLIENT-ID-3", "weight": 300 },
]
```

And reply with a response like:
```
{
  "price": 10.95,
  "trucks": [
    {
      "truckID": "unique truck ID",
      "load": [
        { "id": "ID-1", "weight": 345 },
        { "id": "OTHER-ID-2", "weight": 500 }
      ]
    },
    {
      "truckID": "other unique truck ID",
      "load": [
        { "id": "CLIENT-ID-3", "weight": 300 }
      ]
    }
  ]
}
```

Expose the PDF file with order over HTTP as a static file.
Expose the order history that you stored using database solution of your choice.
