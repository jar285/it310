---
title: Receive Stripe events in your webhook endpoint
subtitle: Listen to events in your Stripe account on your webhook endpoint so your integration can automatically trigger reactions.
route: /webhooks
---

# Receive Stripe events in your webhook endpoint

Listen to events in your Stripe account on your webhook endpoint so your integration can automatically trigger reactions.

You can now send events directly to [Amazon EventBridge as an event destination](https://docs.stripe.com/event-destinations/eventbridge.md).

When building Stripe integrations, you might want your applications to receive events as they occur in your Stripe accounts, so that your backend systems can execute actions accordingly.

Create an event destination to receive events at an HTTPS webhook endpoint. After you register a webhook endpoint, Stripe can push real-time event data to your application’s webhook endpoint when [events](https://docs.stripe.com/event-destinations.md#events-overview) happen in your Stripe account. Stripe uses HTTPS to send webhook events to your app as a JSON payload that includes an [Event object](https://docs.stripe.com/api/events.md).

Receiving webhook events helps you respond to asynchronous events such as when a customer’s bank confirms a payment, a customer disputes a charge, or a recurring payment succeeds.

You can also receive events in [Amazon EventBridge](https://docs.stripe.com/event-destinations/eventbridge.md) with event destinations.

## Get started 

To start receiving webhook events in your app:

1. Create a webhook endpoint handler to receive event data POST requests.
1. Test your webhook endpoint handler locally using the Stripe CLI.
1. Create a new [event destination](https://docs.stripe.com/event-destinations.md) for your webhook endpoint.
1. Secure your webhook endpoint.

You can register and create one endpoint to handle several different event types at the same time, or set up individual endpoints for specific events.

## Create a handler

Use the Stripe API reference to identify the [thin event objects](https://stripe.com/api/v2/events/event-types) or [snapshot event objects](https://docs.stripe.com/api/events/object.md) your webhook handler needs to process.

Set up an HTTP or HTTPS endpoint function that can accept webhook requests with a POST method. If you’re still developing your endpoint function on your local machine, it can use HTTP. After it’s publicly accessible, your webhook endpoint function must use HTTPS.

Set up your endpoint function so that it:

1. Handles POST requests with a JSON payload consisting of an [event object](https://docs.stripe.com/api/events/object.md).

1. Quickly returns a successful status code (`2xx`) prior to any complex logic that might cause a timeout. For example, you must return a `200` response before updating a customer’s invoice as paid in your accounting system.

Alternatively, you can build a webhook endpoint function in your programming language using our [interactive webhook endpoint builder](https://docs.stripe.com/webhooks/quickstart.md).

#### Example endpoint 

This code snippet is a webhook function configured to check for received events from a Stripe account, handle the events, and return a `200` responses. Reference the [snapshot](https://docs.stripe.com/event-destinations.md#events-overview) event handler when you use API v1 resources, and reference the [thin](https://docs.stripe.com/event-destinations.md#events-overview) event handler when you use API v2 resources.

When you create a snapshot event handler, use the API object definition at the time of the event for your logic by accessing the event’s `data.object` fields. You can also retrieve the API resource from the Stripe API to access the latest and up-to-date object definition.

```ruby
require 'json'

# Using Sinatra
post '/webhook' do
  payload = request.body.read
  event = nil

  begin
    event = Stripe::Event.construct_from(
      JSON.parse(payload, symbolize_names: true)
    )
  rescue JSON::ParserError => e
    # Invalid payload
    status 400
    return
  end

  # Handle the event
  case event.type
  when 'payment_intent.succeeded'
    payment_intent = event.data.object # contains a Stripe::PaymentIntent
    # Then define and call a method to handle the successful payment intent.
    # handle_payment_intent_succeeded(payment_intent)
  when 'payment_method.attached'
    payment_method = event.data.object # contains a Stripe::PaymentMethod
    # Then define and call a method to handle the successful attachment of a PaymentMethod.
    # handle_payment_method_attached(payment_method)
  # ... handle other event types
  else
    puts "Unhandled event type: #{event.type}"
  end

  status 200
end
```

```python
import json
from django.http import HttpResponse

# Using Django
@csrf_exempt
def my_webhook_view(request):
  payload = request.body
  event = None

  try:
    event = stripe.Event.construct_from(
      json.loads(payload), stripe.api_key
    )
  except ValueError as e:
    # Invalid payload
    return HttpResponse(status=400)

  # Handle the event
  if event.type == 'payment_intent.succeeded':
    payment_intent = event.data.object # contains a stripe.PaymentIntent
    # Then define and call a method to handle the successful payment intent.
    # handle_payment_intent_succeeded(payment_intent)
  elif event.type == 'payment_method.attached':
    payment_method = event.data.object # contains a stripe.PaymentMethod
    # Then define and call a method to handle the successful attachment of a PaymentMethod.
    # handle_payment_method_attached(payment_method)
  # ... handle other event types
  else:
    print('Unhandled event type {}'.format(event.type))

  return HttpResponse(status=200)
```

```php
$payload = @file_get_contents('php://input');
$event = null;

try {
    $event = \Stripe\Event::constructFrom(
        json_decode($payload, true)
    );
} catch(\UnexpectedValueException $e) {
    // Invalid payload
    http_response_code(400);
    exit();
}

// Handle the event
switch ($event->type) {
    case 'payment_intent.succeeded':
        $paymentIntent = $event->data->object; // contains a \Stripe\PaymentIntent
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded($paymentIntent);
        break;
    case 'payment_method.attached':
        $paymentMethod = $event->data->object; // contains a \Stripe\PaymentMethod
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached($paymentMethod);
        break;
    // ... handle other event types
    default:
        echo 'Received unknown event type ' . $event->type;
}

http_response_code(200);
```

```java
// Using the Spark framework (http://sparkjava.com)
public Object handle(Request request, Response response) {
  String payload = request.body();
  Event event = null;

  try {
    event = ApiResource.GSON.fromJson(payload, Event.class);
  } catch (JsonSyntaxException e) {
    // Invalid payload
    response.status(400);
    return "";
  }

  // Deserialize the nested object inside the event
  EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
  StripeObject stripeObject = null;
  if (dataObjectDeserializer.getObject().isPresent()) {
    stripeObject = dataObjectDeserializer.getObject().get();
  } else {
    // Deserialization failed, probably due to an API version mismatch.
    // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
    // instructions on how to handle this case, or return an error here.
  }

  // Handle the event
  switch (event.getType()) {
    case "payment_intent.succeeded":
      PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      PaymentMethod paymentMethod = (PaymentMethod) stripeObject;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      System.out.println("Unhandled event type: " + event.getType());
  }

  response.status(200);
  return "";
}
```

```javascript
// This example uses Express to receive webhooks
const express = require('express');
const app = express();

// Match the raw body to content type application/json
// If you are using Express v4 - v4.16 you need to use body-parser, not express, to retrieve the request body
app.post('/webhook', express.json({type: 'application/json'}), (request, response) => {
  const event = request.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});

app.listen(4242, () => console.log('Running on port 4242'));
```

```go
http.HandleFunc("/webhook", func(w http.ResponseWriter, req *http.Request) {
    const MaxBodyBytes = int64(65536)
    req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
    payload, err := ioutil.ReadAll(req.Body)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", err)
        w.WriteHeader(http.StatusServiceUnavailable)
        return
    }

    event := stripe.Event{}

    if err := json.Unmarshal(payload, &event); err != nil {
        fmt.Fprintf(os.Stderr, "Failed to parse webhook body json: %v\n", err.Error())
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    // Unmarshal the event data into an appropriate struct depending on its Type
    switch event.Type {
    case "payment_intent.succeeded":
        var paymentIntent stripe.PaymentIntent
        err := json.Unmarshal(event.Data.Raw, &paymentIntent)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
            w.WriteHeader(http.StatusBadRequest)
            return
        }
        // Then define and call a func to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent)
    case "payment_method.attached":
        var paymentMethod stripe.PaymentMethod
        err := json.Unmarshal(event.Data.Raw, &paymentMethod)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
            w.WriteHeader(http.StatusBadRequest)
            return
        }
        // Then define and call a func to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod)
    // ... handle other event types
    default:
        fmt.Fprintf(os.Stderr, "Unhandled event type: %s\n", event.Type)
    }

    w.WriteHeader(http.StatusOK)
})
```

```dotnet
using System;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace workspace.Controllers
{
    [Route("api/[controller]")]
    public class StripeWebHook : Controller
    {
        [HttpPost]
        public async Task<IActionResult> Index()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ParseEvent(json);

                // Handle the event
                // If on SDK version < 46, use class Events instead of EventTypes
                if (stripeEvent.Type == EventTypes.PaymentIntentSucceeded)
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    // Then define and call a method to handle the successful payment intent.
                    // handlePaymentIntentSucceeded(paymentIntent);
                }
                else if (stripeEvent.Type == EventTypes.PaymentMethodAttached)
                {
                    var paymentMethod = stripeEvent.Data.Object as PaymentMethod;
                    // Then define and call a method to handle the successful attachment of a PaymentMethod.
                    // handlePaymentMethodAttached(paymentMethod);
                }
                // ... handle other event types
                else
                {
                    // Unexpected event type
                    Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
                }
                return Ok();
            }
            catch (StripeException e)
            {
                return BadRequest();
            }
        }
    }
}
```

When you create a thin event handler, use the `fetchRelatedObject()` method to retrieve the latest version of the object associated with the event. Thin events might contain [additional contextual data](https://docs.stripe.com/event-destinations.md#fetch-data) that you can only retrieve with the API. Use the `retrieve()` call with the thin event ID to access these additional payload fields.

```python
import os
from stripe import StripeClient
from stripe.events import V1BillingMeterErrorReportTriggeredEvent

from flask import Flask, request, jsonify

app = Flask(__name__)
api_key = os.environ.get('STRIPE_API_KEY')
webhook_secret = os.environ.get('WEBHOOK_SECRET')

client = StripeClient(api_key)

@app.route('/webhook', methods=['POST'])
def webhook():
    webhook_body = request.data
    sig_header = request.headers.get('Stripe-Signature')

try:
    thin_event = client.parse_thin_event(webhook_body, sig_header, webhook_secret)

    # Fetch the event data to understand the failure
    event = client.v2.core.events.retrieve(thin_event.id)
    if isinstance(event, V1BillingMeterErrorReportTriggeredEvent):
        meter = event.fetch_related_object()
        meter_id = meter.id

        # Record the failures and alert your team
        # Add your logic here

    return jsonify(success=True), 200
except Exception as e:
    return jsonify(error=str(e)), 400

if __name__ == '__main__':
    app.run(port=4242)
```

```ruby
require "stripe"
require "sinatra"

api_key = ENV.fetch("STRIPE_API_KEY", nil)
# Retrieve the webhook secret from the environment variable
webhook_secret = ENV.fetch("WEBHOOK_SECRET", nil)

client = Stripe::StripeClient.new(api_key)

post "/webhook" do
  webhook_body = request.body.read
  sig_header = request.env["HTTP_STRIPE_SIGNATURE"]
  thin_event = client.parse_thin_event(webhook_body, sig_header, webhook_secret)

  # Fetch the event data to understand the failure
  event = client.v2.core.events.retrieve(thin_event.id)
  if event.instance_of? Stripe::V1BillingMeterErrorReportTriggeredEvent
    meter = event.fetch_related_object
    meter_id = meter.id
  end

  # Record the failures and alert your team
  # Add your logic here
  status 200
end
```

```php
<?php

require 'vendor/autoload.php';

$api_key = getenv('STRIPE_API_KEY');
$webhook_secret = getenv('WEBHOOK_SECRET');

$app = new \Slim\App();
$client = new \Stripe\StripeClient($api_key);

$app->post('/webhook', function ($request, $response) use ($client, $webhook_secret) {
    $webhook_body = $request->getBody()->getContents();
    $sig_header = $request->getHeaderLine('Stripe-Signature');

    try {
        $thin_event = $client->parseThinEvent($webhook_body, $sig_header, $webhook_secret);

        // Fetch the event data to understand the failure
        $event = $client->v2->core->events->retrieve($thin_event->id);
        if ($event instanceof \Stripe\Events\V1BillingMeterErrorReportTriggeredEvent) {
            $meter = $event->fetchRelatedObject();
            $meter_id = $meter->id;

            // Record the failures and alert your team
            // Add your logic here
        }
        return $response->withStatus(200);
    } catch (\Exception $e) {
        return $response->withStatus(400)->withJson(['error' => $e->getMessage()]);
    }
});

$app->run();
```

```java
import com.stripe.StripeClient;
import com.stripe.events.V1BillingMeterErrorReportTriggeredEvent;
import com.stripe.exception.StripeException;
import com.stripe.model.ThinEvent;
import com.stripe.model.billing.Meter;
import com.stripe.model.v2.Event;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class StripeWebhookHandler {
  private static final String API_KEY = System.getenv("STRIPE_API_KEY");
  private static final String WEBHOOK_SECRET = System.getenv("WEBHOOK_SECRET");

  private static final StripeClient client = new StripeClient(API_KEY);

  public static void main(String[] args) throws IOException {

    HttpServer server = HttpServer.create(new InetSocketAddress(4242), 0);
    server.createContext("/webhook", new WebhookHandler());
    server.setExecutor(null);
    server.start();
  }

  static class WebhookHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
      if ("POST".equals(exchange.getRequestMethod())) {
        InputStream requestBody = exchange.getRequestBody();
        String webhookBody = new String(requestBody.readAllBytes(), StandardCharsets.UTF_8);
        String sigHeader = exchange.getRequestHeaders().getFirst("Stripe-Signature");

        try {
          ThinEvent thinEvent = client.parseThinEvent(webhookBody, sigHeader, WEBHOOK_SECRET);

          // Fetch the event data to understand the failure
          Event baseEvent = client.v2().core().events().retrieve(thinEvent.getId());
          if (baseEvent instanceof V1BillingMeterErrorReportTriggeredEvent) {
            V1BillingMeterErrorReportTriggeredEvent event =
                (V1BillingMeterErrorReportTriggeredEvent) baseEvent;
            Meter meter = event.fetchRelatedObject();

            String meterId = meter.getId();

            // Record the failures and alert your team
            // Add your logic here
          }

          exchange.sendResponseHeaders(200, -1);
        } catch (StripeException e) {
          exchange.sendResponseHeaders(400, -1);
        }
      } else {
        exchange.sendResponseHeaders(405, -1);
      }
      exchange.close();
    }
  }
}
```

```javascript
const express = require('express');
const {Stripe} = require('stripe');

const app = express();

const apiKey = process.env.STRIPE_API_KEY;
const webhookSecret = process.env.WEBHOOK_SECRET;

const client = new Stripe(apiKey);

app.post(
  '/webhook',
  express.raw({type: 'application/json'}),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
      const thinEvent = client.parseThinEvent(req.body, sig, webhookSecret);

      // Fetch the event data to understand the failure
      const event = await client.v2.core.events.retrieve(thinEvent.id);
      if (event.type == 'v1.billing.meter.error_report_triggered') {
        const meter = await event.fetchRelatedObject();
        const meterId = meter.id;
        // Record the failures and alert your team
        // Add your logic here
      }
      res.sendStatus(200);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
);

app.listen(4242, () => console.log('Running on port 4242'));
```

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Events;
[Route("api/[controller]")]
[ApiController]
public class WebhookController : ControllerBase
{
    private readonly StripeClient _client;
    private readonly string _webhookSecret;
    public WebhookController()
    {
        var apiKey = Environment.GetEnvironmentVariable("STRIPE_API_KEY");
        _client = new StripeClient(apiKey);
        _webhookSecret = Environment.GetEnvironmentVariable("WEBHOOK_SECRET");
    }
    [HttpPost]
    public async Task<IActionResult> Index()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try
        {
            var thinEvent = _client.ParseThinEvent(json, Request.Headers["Stripe-Signature"], _webhookSecret);
            // Fetch the event data to understand the failure
            var baseEvent = await _client.V2.Core.Events.GetAsync(thinEvent.Id);
            if (baseEvent is V1BillingMeterErrorReportTriggeredEvent fullEvent)
            {
                var meter = await fullEvent.FetchRelatedObjectAsync();
                var meterId = meter.Id;
                // Record the failures and alert your team
                // Add your logic here
            }
            return Ok();
        }
        catch (StripeException e)
        {
            return BadRequest(e.Message);
        }
    }
}
```

## Test your handler

Before you go-live with your webhook endpoint function, we recommend that you test your application integration. You can do so by configuring a local listener to send events to your local machine, and sending test events. You need to use the [CLI](https://docs.stripe.com/stripe-cli.md) to test.

#### Forward events to a local endpoint 

To forward events to your local endpoint, run the following command with the [CLI](https://docs.stripe.com/stripe-cli.md) to set up a local listener. The `--forward-to` flag sends all [Stripe events](https://docs.stripe.com/cli/trigger#trigger-event) in a [sandbox](https://docs.stripe.com/sandboxes.md) to your local webhook endpoint. Use the appropriate CLI commands below depending on whether you use [thin](https://docs.stripe.com/event-destinations.md#events-overview) or snapshot events.

Use the following command to forward [snapshot events](https://docs.stripe.com/event-destinations.md#events-overview) to your local listener.

```bash
stripe listen --forward-to localhost:4242/webhook
```

Use the following command to forward [thin events](https://docs.stripe.com/event-destinations.md#events-overview) to your local listener.

```bash
$ stripe listen --forward-thin-to localhost:4242/webhooks --thin-events "*"
```

You can also run `stripe listen` to see events in [Stripe Shell](https://docs.stripe.com/stripe-shell/overview.md), although you won’t be able to forward events from the shell to your local endpoint.

Useful configurations to help you test with your local listener include the following:

- To disable HTTPS certificate verification, use the `--skip-verify` optional flag.
- To forward only specific events, use the `--events` optional flag and pass in a comma separated list of events.

Use the following command to forward target snapshot events to your local listener.

```bash
stripe listen --events payment_intent.created,customer.created,payment_intent.succeeded,checkout.session.completed,payment_intent.payment_failed \
  --forward-to localhost:4242/webhook
```

Use the following command to forward target thin events to your local listener.

```bash
stripe listen --thin-events v1.billing.meter.error_report_triggered,v1.billing.meter.no_meter_found \
  --forward-thin-to localhost:4242/webhook
```

- To forward events to your local webhook endpoint from the public webhook endpoint that you already registered on Stripe, use the `--load-from-webhooks-api` optional flag. It loads your registered endpoint, parses the path and its registered events, then appends the path to your local webhook endpoint in the `--forward-to path`.

Use the following command to forward snapshot events from a public webhook endpoint to your local listener.

```bash
stripe listen --load-from-webhooks-api --forward-to localhost:4242/webhook
```

Use the following command to forward thin events from a public webhook endpoint to your local listener.

```bash
stripe listen --load-from-webhooks-api --forward-thin-to localhost:4242/webhook
```

- To check webhook signatures, use the `{{WEBHOOK_SIGNING_SECRET}}` from the initial output of the listen command.

```output
Ready! Your webhook signing secret is '{{WEBHOOK_SIGNING_SECRET}}' (^C to quit)
```

#### Triggering test events 

To send test events, trigger an event type that your event destination is subscribed to by manually creating an object in the Stripe Dashboard. Learn how to trigger events with [Stripe for VS Code](https://docs.stripe.com/stripe-vscode.md).

You can use the following command in either [Stripe Shell](https://docs.stripe.com/stripe-shell/overview.md) or [Stripe CLI](https://docs.stripe.com/stripe-cli.md).
This example triggers a `payment_intent.succeeded` event:

```bash
stripe trigger payment_intent.succeeded
Running fixture for: payment_intent
Trigger succeeded! Check dashboard for event details.
```

You can use the following command in the [Stripe CLI](https://docs.stripe.com/stripe-cli.md).
This example triggers a `outbound_payment.posted` event:

```bash
stripe preview trigger outbound_payment.posted
Setting up fixture for: finaddr_info
Running fixture for: finaddr_info
Setting up fixture for: create_recipient
Running fixture for: create_recipient
Setting up fixture for: create_destination
Running fixture for: create_destination
Setting up fixture for: create_outbound_payment
Running fixture for: create_outbound_payment
```

## Register your endpoint

After testing your webhook endpoint function, use the [API](https://docs.stripe.com/api/v2/event-destinations.md) or the **Webhooks** tab in Workbench to register your webhook endpoint’s accessible URL so Stripe knows where to deliver events. You can register up to 16 webhook endpoints with Stripe. Registered webhook endpoints must be publicly accessible **HTTPS** URLs.

#### Webhook URL format 

The URL format to register a webhook endpoint is:

```
https://<your-website>/<your-webhook-endpoint>
```

For example, if your domain is `https://mycompanysite.com` and the route to your webhook endpoint is `@app.route('/stripe_webhooks', methods=['POST'])`, specify `https://mycompanysite.com/stripe_webhooks` as the **Endpoint URL**.

#### Create an event destination for your webhook endpoint 

Create an event destination using Workbench in the Dashboard or programmatically with the [API](https://docs.stripe.com/api/v2/event-destinations.md). You can register up to 16 event destinations on each Stripe account.

To create a new webhook endpoint in the Dashboard:

1. Open the [Webhooks](https://dashboard.stripe.com/webhooks) tab in Workbench.
1. Click **Create an event destination**.
1. Select where you want to receive events from. Stripe supports two types of configurations: **Your account** and [Connected accounts](https://docs.stripe.com/connect.md). Select **Account** to listen to events from your own account. If you created a [Connect application](https://docs.stripe.com/connect.md) and want to listen to events from your connected accounts, select **Connected accounts**.

4. Select the API version for the [events object](https://docs.stripe.com/api/events.md) you want to consume.
1. Select the [event types](https://docs.stripe.com/api/events/types.md) that you want to send to a webhook endpoint.
1. Select **Continue**, then select **Webhook endpoint** as the destination type.
1. Click **Continue**, then provide the **Endpoint URL** and an optional description for the webhook.

![Register a new webhook using the Webhooks tab](images/development/webhooks/create-webhook.png)
Register a new webhook using the **Webhooks** tab


You can create a new event destination that notifies you when a [usage-based billing](https://docs.stripe.com/billing/subscriptions/usage-based.md) validation error is triggered using the [API](https://docs.stripe.com/api/v2/event-destinations.md).

If you’ve created a [Connect application](https://docs.stripe.com/connect.md) and want to listen to your connected accounts, use the [events_from](https://docs.stripe.com/api/v2/event-destinations/create.md#v2_create_event_destinations-events_from) parameter and set its enum value to `accounts`.

[Workbench](https://docs.stripe.com/workbench.md) replaces the existing [Developers Dashboard](https://docs.stripe.com/development/dashboard.md). If you’re still using the Developers Dashboard, see how to [create a new webhook endpoint](https://docs.stripe.com/development/dashboard/webhooks.md).

## Secure your endpoint

After confirming that your endpoint works as expected, secure it by implementing [webhook best practices](https://docs.stripe.com/webhooks.md#best-practices).

You need to secure your integration by making sure your handler verifies that all webhook requests are generated by Stripe. You can verify webhook signatures using our official libraries or verify them manually.

### Verify webhook signatures with official libraries

We recommend using our official libraries to verify signatures. You perform the verification by providing the event payload, the `Stripe-Signature` header, and the endpoint’s secret. If verification fails, you get an error.

If you get a signature verification error, read our guide about [troubleshooting it](https://docs.stripe.com/webhooks/signature.md).

Stripe requires the raw body of the request to perform signature verification. If you’re using a framework, make sure it doesn’t manipulate the raw body. Any manipulation to the raw body of the request causes the verification to fail.

```ruby
<<setup key>>

require 'stripe'
require 'sinatra'

# If you are testing your webhook locally with the Stripe CLI you
# can find the endpoint's secret by running `stripe listen`
# Otherwise, find your endpoint's secret in your webhook settings in
# the Developer Dashboard
endpoint_secret = 'whsec_...'

# Using the Sinatra framework
set :port, 4242

post '/my/webhook/url' do
  payload = request.body.read
  sig_header = request.env['HTTP_STRIPE_SIGNATURE']
  event = nil

  begin
    event = Stripe::Webhook.construct_event(
      payload, sig_header, endpoint_secret
    )
  rescue JSON::ParserError => e
    # Invalid payload
    puts "Error parsing payload: #{e.message}"
    status 400
    return
  rescue Stripe::SignatureVerificationError => e
    # Invalid signature
    puts "Error verifying webhook signature: #{e.message}"
    status 400
    return
  end

  # Handle the event
  case event.type
  when 'payment_intent.succeeded'
    payment_intent = event.data.object # contains a Stripe::PaymentIntent
    puts 'PaymentIntent was successful!'
  when 'payment_method.attached'
    payment_method = event.data.object # contains a Stripe::PaymentMethod
    puts 'PaymentMethod was attached to a Customer!'
  # ... handle other event types
  else
    puts "Unhandled event type: #{event.type}"
  end

  status 200
end
```

```python
<<setup key>>

from django.http import HttpResponse

# If you are testing your webhook locally with the Stripe CLI you
# can find the endpoint's secret by running `stripe listen`
# Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
endpoint_secret = 'whsec_...'

# Using Django
@csrf_exempt
def my_webhook_view(request):
  payload = request.body
  sig_header = request.META['HTTP_STRIPE_SIGNATURE']
  event = None

  try:
    event = stripe.Webhook.construct_event(
      payload, sig_header, endpoint_secret
    )
  except ValueError as e:
    # Invalid payload
    print('Error parsing payload: {}'.format(str(e)))
    return HttpResponse(status=400)
  except stripe.error.SignatureVerificationError as e:
    # Invalid signature
    print('Error verifying webhook signature: {}'.format(str(e)))
    return HttpResponse(status=400)

  # Handle the event
  if event.type == 'payment_intent.succeeded':
    payment_intent = event.data.object # contains a stripe.PaymentIntent
    print('PaymentIntent was successful!')
  elif event.type == 'payment_method.attached':
    payment_method = event.data.object # contains a stripe.PaymentMethod
    print('PaymentMethod was attached to a Customer!')
  # ... handle other event types
  else:
    print('Unhandled event type {}'.format(event.type))

  return HttpResponse(status=200)
```

```php
<<setup key>>

// If you are testing your webhook locally with the Stripe CLI you
// can find the endpoint's secret by running `stripe listen`
// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
$endpoint_secret = 'whsec_...';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$event = null;

try {
    $event = \Stripe\Webhook::constructEvent(
        $payload, $sig_header, $endpoint_secret
    );
} catch(\UnexpectedValueException $e) {
    // Invalid payload
  http_response_code(400);
  echo json_encode(['Error parsing payload: ' => $e->getMessage()]);
  exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    // Invalid signature
    http_response_code(400);
    echo json_encode(['Error verifying webhook signature: ' => $e->getMessage()]);
    exit();
}

// Handle the event
switch ($event->type) {
    case 'payment_intent.succeeded':
        $paymentIntent = $event->data->object; // contains a \Stripe\PaymentIntent
        handlePaymentIntentSucceeded($paymentIntent);
        break;
    case 'payment_method.attached':
        $paymentMethod = $event->data->object; // contains a \Stripe\PaymentMethod
        handlePaymentMethodAttached($paymentMethod);
        break;
    // ... handle other event types
    default:
        echo 'Received unknown event type ' . $event->type;
}

http_response_code(200);
```

```java
<<setup key>>

import com.stripe.Stripe;
import com.stripe.model.StripeObject;
import com.stripe.net.ApiResource;
import com.stripe.net.Webhook;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.exception.SignatureVerificationException;

// If you are testing your webhook locally with the Stripe CLI you
// can find the endpoint's secret by running `stripe listen`
// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
String endpointSecret = "whsec_...";

// Using the Spark framework
public Object handle(Request request, Response response) {
  String payload = request.body();
  String sigHeader = request.headers("Stripe-Signature");
  Event event = null;

  try {
    event = Webhook.constructEvent(
      payload, sigHeader, endpointSecret
    );
  } catch (JsonSyntaxException e) {
    // Invalid payload
    System.out.println("Error parsing payload: " + e.getMessage());
    response.status(400);
    return gson.toJson(new ErrorResponse(e.getMessage()));
  } catch (SignatureVerificationException e) {
    // Invalid signature
    System.out.println("Error verifying webhook signature: " + e.getMessage());
    response.status(400);
    return gson.toJson(new ErrorResponse(e.getMessage()));
  }

  // Deserialize the nested object inside the event
  EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
  StripeObject stripeObject = null;
  if (dataObjectDeserializer.getObject().isPresent()) {
    stripeObject = dataObjectDeserializer.getObject().get();
  } else {
    // Deserialization failed, probably due to an API version mismatch.
    // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
    // instructions on how to handle this case, or return an error here.
  }

  // Handle the event
  switch (event.getType()) {
    case "payment_intent.succeeded":
      PaymentIntent paymentIntent = (PaymentIntent) stripeObject;
      System.out.println("PaymentIntent was successful!");
      break;
    case "payment_method.attached":
      PaymentMethod paymentMethod = (PaymentMethod) stripeObject;
      System.out.println("PaymentMethod was attached to a Customer!");
      break;
    // ... handle other event types
    default:
      System.out.println("Unhandled event type: " + event.getType());
  }

  response.status(200);
  return "";
}
```

```javascript
<<setup key>>

// If you are testing your webhook locally with the Stripe CLI you
// can find the endpoint's secret by running `stripe listen`
// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
const endpointSecret = 'whsec_...';

// This example uses Express to receive webhooks
const express = require('express');

const app = express();

// Match the raw body to content type application/json
app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
});

app.listen(4242, () => console.log('Running on port 4242'));
```

```go
<<setup key>>

http.HandleFunc("/webhook", func(w http.ResponseWriter, req *http.Request) {
    const MaxBodyBytes = int64(65536)
    req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
    payload, err := ioutil.ReadAll(req.Body)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", err)
        w.WriteHeader(http.StatusServiceUnavailable)
        return
    }

    // If you are testing your webhook locally with the Stripe CLI you
    // can find the endpoint's secret by running `stripe listen`
    // Otherwise, find your endpoint's secret in your webhook settings
    // in the Developer Dashboard
    endpointSecret := "whsec_...";

    // Pass the request body and Stripe-Signature header to ConstructEvent, along
    // with the webhook signing key.
    event, err := webhook.ConstructEvent(payload, req.Header.Get("Stripe-Signature"),
        endpointSecret)

    if err != nil {
        fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", err)
        w.WriteHeader(http.StatusBadRequest) // Return a 400 error on a bad signature
        return
    }

    // Unmarshal the event data into an appropriate struct depending on its Type
    switch event.Type {
    case "payment_intent.succeeded":
        var paymentIntent stripe.PaymentIntent
        err := json.Unmarshal(event.Data.Raw, &paymentIntent)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
            w.WriteHeader(http.StatusBadRequest)
            return
        }
        fmt.Println("PaymentIntent was successful!")
    case "payment_method.attached":
        var paymentMethod stripe.PaymentMethod
        err := json.Unmarshal(event.Data.Raw, &paymentMethod)
        if err != nil {
            fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
            w.WriteHeader(http.StatusBadRequest)
            return
        }
        fmt.Println("PaymentMethod was attached to a Customer!")
    // ... handle other event types
    default:
        fmt.Fprintf(os.Stderr, "Unhandled event type: %s\n", event.Type)
    }

    w.WriteHeader(http.StatusOK)
})
```

```dotnet
<<setup key>>

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace workspace.Controllers
{
    [Route("api/[controller]")]
    public class StripeWebHook : Controller
    {
        // If you are testing your webhook locally with the Stripe CLI you
        // can find the endpoint's secret by running `stripe listen`
        // Otherwise, find your endpoint's secret in your webhook settings
        // in the Developer Dashboard
        const string endpointSecret = "whsec_...";

        [HttpPost]
        public async Task<IActionResult> Index()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], endpointSecret);

                // Handle the event
                // If on SDK version < 46, use class Events instead of EventTypes
                if (stripeEvent.Type == EventTypes.PaymentIntentSucceeded)
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    Console.WriteLine("PaymentIntent was successful!");
                }
                else if (stripeEvent.Type == EventTypes.PaymentMethodAttached)
                {
                    var paymentMethod = stripeEvent.Data.Object as PaymentMethod;
                    Console.WriteLine("PaymentMethod was attached to a Customer!");
                }
                // ... handle other event types
                else
                {
                    Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
                }

                return Ok();
            }
            catch (StripeException e)
            {
              return BadRequest(e.Message);
            }
        }
    }
}
```

### Verify webhook signatures manually 

Although we recommend that you use our official libraries to verify webhook event signatures, you can create a custom solution by following this section.

The `Stripe-Signature` header included in each signed event contains a timestamp and one or more signatures that you must verify. The timestamp has a `t=` prefix, and each signature has a _scheme_ prefix. Schemes start with `v`, followed by an integer. Currently, the only valid live signature scheme is `v1`. To aid with testing, Stripe sends an additional signature with a fake `v0` scheme, for test events.

```
Stripe-Signature:
t=1492774577,
v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd,
v0=6ffbb59b2300aae63f272406069a9788598b792a944a07aba816edb039989a39
```

We provide newlines for clarity, but a real `Stripe-Signature` header is on a single line.

Stripe generates signatures using a hash-based message authentication code ([HMAC](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)) with [SHA-256](https://en.wikipedia.org/wiki/SHA-2). To prevent [downgrade attacks](https://en.wikipedia.org/wiki/Downgrade_attack), ignore all schemes that aren’t `v1`.

You can have multiple signatures with the same scheme-secret pair when you [roll an endpoint’s secret](https://docs.stripe.com/webhooks.md#roll-endpoint-secrets), and keep the previous secret active for up to 24 hours. During this time, your endpoint has multiple active secrets and Stripe generates one signature for each secret.

To create a manual solution for verifying signatures, you must complete the following steps:

#### Step 1: Extract the timestamp and signatures from the header 

Split the header using the `,` character as the separator to get a list of elements. Then split each element using the `=` character as the separator to get a prefix and value pair.

The value for the prefix `t` corresponds to the timestamp, and `v1` corresponds to the signature (or signatures). You can discard all other elements.

#### Step 2: Prepare the `signed_payload` string 

The `signed_payload` string is created by concatenating:

- The timestamp (as a string)
- The character `.`
- The actual JSON payload (that is, the request body)

#### Step 3: Determine the expected signature 

Compute an HMAC with the SHA256 hash function. Use the endpoint’s signing secret as the key, and use the `signed_payload` string as the message.

#### Step 4: Compare the signatures 

Compare the signature (or signatures) in the header to the expected signature. For an equality match, compute the difference between the current timestamp and the received timestamp, then decide if the difference is within your tolerance.

To protect against timing attacks, use a constant-time-string comparison to compare the expected signature to each of the received signatures.

## Debug webhook integrations 

Multiple types of issues can occur when delivering events to your webhook endpoint:

* Stripe might not be able to deliver an event to your webhook endpoint.
* Your webhook endpoint might have an SSL issue.
* Your network connectivity is intermittent.
* Your webhook endpoint isn’t receiving events that you expect to receive.

### View event deliveries 

You can also use the [Stripe CLI](https://docs.stripe.com/stripe-cli.md) to [listen for events](https://docs.stripe.com/webhooks.md#test-webhook) directly in your terminal.

To view event deliveries, select the webhook endpoint under **Webhooks**, then select the **Events** tab.

The **Events** tab provides a list of events and whether they’re `Delivered`, `Pending`, or `Failed`. Click an event to view the `Delivery attempts`, which includes the HTTP status code of previous delivery attempts and the time of pending future deliveries.

![View event delivery attempts on a webhook's Events tab](images/development/webhooks/view-events.png)
View event delivery attempts on a webhook endpoint’s **Events** tab.


### Fix HTTP status codes

When an event displays a status code of `200`, it indicates successful delivery to the webhook endpoint. You might also receive a status code other than `200`. View the table below for a list of common HTTP status codes and recommended solutions.

| Pending webhook status              | Description                                                                                                                                                                                                                                                       | Fix                                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| (Unable to connect) ERR             | We’re unable to establish a connection to the destination server.                                                                                                                                                                                                 | Make sure that your host domain is publicly accessible to the internet.                                                             |
| (`302`) ERR (or other `3xx` status) | The destination server attempted to redirect the request to another location. We consider redirect responses to webhook requests as failures.                                                                                                                     | Set the webhook endpoint destination to the URL resolved by the redirect.                                                           |
| (`400`) ERR (or other `4xx` status) | The destination server can’t or won’t process the request. This might occur when the server detects an error (`400`), when the destination URL has access restrictions, (`401`, `403`), or when the destination URL doesn’t exist (`404`).                        | * Make sure that your endpoint is publicly accessible to the internet.
  * Make sure that your endpoint accepts a POST HTTP method. |
| (`500`) ERR (or other `5xx` status) | The destination server encountered an error while processing the request.                                                                                                                                                                                         | Review your application’s logs to understand why it’s returning a `500` error.                                                      |
| (TLS error) ERR                     | We couldn’t establish a secure connection to the destination server. Issues with the SSL/TLS certificate or an intermediate certificate in the destination server’s certificate chain usually cause these errors. Stripe requires *TLS* version `v1.2` or higher. | Perform an [SSL server test](https://www.ssllabs.com/ssltest/) to find issues that might cause this error.                          |
| (Timed out) ERR                     | The destination server took too long to respond to the webhook request.                                                                                                                                                                                           | Make sure you defer complex logic and return a successful response immediately in your webhook handling code.                       |

## Event delivery behaviors 

This section helps you understand different behaviors to expect regarding how Stripe sends events to your webhook endpoint.

### Automatic retries

Stripe attempts to deliver events to your destination for up to three days with an exponential back off in live mode. View when the next retry will occur, if applicable, in your event destination’s **Event deliveries** tab.
We retry event deliveries created in a sandbox three times over the course of a few hours.
If your destination has been disabled or deleted when we attempt a retry, we prevent future retries of that event. However, if you disable and then re-enable the event destination before we’re able to retry, you still see future retry attempts.

### Manual retries

You can’t manually resend events to Amazon EventBridge.

There are two ways to manually retry events:

- In the Stripe Dashboard, click **Resend** when looking at a specific event. This works for up to 15 days after the event creation.
- With the [Stripe CLI](https://docs.stripe.com/cli/events/resend), run the `stripe events resend <event_id> --webhook-endpoint=<endpoint_id>` command. This works for up to 30 days after the event creation.

### Event ordering

Stripe doesn’t guarantee the delivery of events in the order that they’re generated. For example, creating a subscription might generate the following events:

- `customer.subscription.created`
- `invoice.created`
- `invoice.paid`
- `charge.created` (if there’s a charge)

Make sure that your event destination isn’t dependent on receiving events in a specific order. Be prepared to manage their delivery appropriately.
You can also use the API to retrieve any missing objects. For example, you can retrieve the invoice, charge, and subscription objects with the information from `invoice.paid` if you receive this event first.

### API versioning

## Best practices for using webhooks 

Review these best practices to make sure your webhook endpoints remain secure and function well with your integration.

### Handle duplicate events

Webhook endpoints might occasionally receive the same event more than once. You can guard against duplicated event receipts by logging the [event IDs](https://docs.stripe.com/api/events/object.md#event_object-id) you’ve processed, and then not processing already-logged events.

In some cases, two separate Event objects are generated and sent. To identify these duplicates, use the ID of the object in `data.object` along with the `event.type`.

### Only listen to event types your integration requires

Configure your webhook endpoints to receive only the types of events required by your integration. Listening for extra events (or all events) puts undue strain on your server and we don’t recommend it.

You can [change the events](https://docs.stripe.com/api/webhook_endpoints/update.md#update_webhook_endpoint-enabled_events) that a webhook endpoint receives in the Dashboard or with the API.

### Handle events asynchronously

Configure your handler to process incoming events with an asynchronous queue. You might encounter scalability issues if you choose to process events synchronously. Any large spike in webhook deliveries (for example, during the beginning of the month when all subscriptions renew) might overwhelm your endpoint hosts.

Asynchronous queues allow you to process the concurrent events at a rate your system can support.

### Exempt webhook route from CSRF protection 

If you’re using Rails, Django, or another web framework, your site might automatically check that every POST request contains a _CSRF token_. This is an important security feature that helps protect you and your users from [cross-site request forgery](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_\(CSRF\)) attempts. However, this security measure might also prevent your site from processing legitimate events. If so, you might need to exempt the webhooks route from CSRF protection.

```ruby
class StripeController < ApplicationController
  # If your controller accepts requests other than Stripe webhooks,
  # you'll probably want to use `protect_from_forgery` to add CSRF
  # protection for your application. But don't forget to exempt
  # your webhook route!
  protect_from_forgery except: :webhook

  def webhook
    # Process webhook data in `params`
  end
end
```

```python
import json

# Webhooks are always sent as HTTP POST requests, so ensure
# that only POST requests reach your webhook view by
# decorating `webhook()` with `require_POST`.
#
# To ensure that the webhook view can receive webhooks,
# also decorate `webhook()` with `csrf_exempt`.
@require_POST
@csrf_exempt
def webhook(request):
  # Process webhook data in `request.body`
```

### Receive events with an HTTPS server

If you use an HTTPS URL for your webhook endpoint (required in live mode), Stripe validates that the connection to your server is secure before sending your webhook data. For this to work, your server must be correctly configured to support HTTPS with a valid server certificate. Stripe webhooks support only *TLS* versions v1.2 and v1.3.

### Roll endpoint signing secrets periodically 

The secret used for verifying that events come from Stripe is modifiable in the **Webhooks** tab in Workbench. To keep them safe, we recommend that you roll (change) secrets periodically, or when you suspect a compromised secret.

To roll a secret:

1. Click each endpoint in the Workbench **Webhooks** tab that you want to roll the secret for.
1. Navigate to the overflow menu (⋯) and click **Roll secret**. You can choose to immediately expire the current secret or delay its expiration for up to 24 hours to allow yourself time to update the verification code on your server. During this time, multiple secrets are active for the endpoint. Stripe generates one signature per secret until expiration.

### Verify events are sent from Stripe 

Stripe sends webhook events from a set list of IP addresses. Only trust events coming from these [IP addresses](https://docs.stripe.com/ips.md).

Also verify webhook signatures to confirm that Stripe sent the received events. Stripe signs webhook events it sends to your endpoints by including a signature in each event’s `Stripe-Signature` header. This allows you to verify that the events were sent by Stripe, not by a third party. You can verify signatures either using our [official libraries](#verify-official-libraries), or [verify manually](#verify-manually) using your own solution.

The following section describes how to verify webhook signatures:

1. Retrieve your endpoint’s secret.
1. Verify the signature.

#### Retrieving your endpoint’s secret 

Use Workbench and navigate to the **Webhooks** tab to view all your endpoints. Select an endpoint that you want to obtain the secret for, then click **Click to reveal**.

Stripe generates a unique secret key for each endpoint. If you use the same endpoint for both [test and live API keys](https://docs.stripe.com/keys.md#test-live-modes), the secret is different for each one. Additionally, if you use multiple endpoints, you must obtain a secret for each one you want to verify signatures on. After this setup, Stripe starts to sign each webhook it sends to the endpoint.

### Preventing replay attacks 

A [replay attack](https://en.wikipedia.org/wiki/Replay_attack) is when an attacker intercepts a valid payload and its signature, then re-transmits them. To mitigate such attacks, Stripe includes a timestamp in the `Stripe-Signature` header. Because this timestamp is part of the signed payload, it’s also verified by the signature, so an attacker can’t change the timestamp without invalidating the signature. If the signature is valid but the timestamp is too old, you can have your application reject the payload.

Our libraries have a default tolerance of 5 minutes between the timestamp and the current time. You can change this tolerance by providing an additional parameter when verifying signatures. Use Network Time Protocol ([NTP](https://en.wikipedia.org/wiki/Network_Time_Protocol)) to make sure that your server’s clock is accurate and synchronizes with the time on Stripe’s servers.

Don’t use a tolerance value of `0`. Using a tolerance value of `0` disables the recency check entirely.

Stripe generates the timestamp and signature each time we send an event to your endpoint. If Stripe retries an event (for example, your endpoint previously replied with a non-`2xx` status code), then we generate a new signature and timestamp for the new delivery attempt.

### Quickly return a 2xx response 

Your [endpoint](https://docs.stripe.com/webhooks.md#example-endpoint) must quickly return a successful status code (`2xx`) prior to any complex logic that could cause a timeout. For example, you must return a `200` response before updating a customer’s invoice as paid in your accounting system.

## See Also

* [Send events to Amazon EventBridge](https://docs.stripe.com/event-destinations/eventbridge.md)
* [List of thin event types](https://docs.stripe.com/api/v2/events/event-types.md)
* [List of snapshot event types](https://docs.stripe.com/api/events/.md)
* [Interactive webhook endpoint builder](https://docs.stripe.com/webhooks/quickstart.md)