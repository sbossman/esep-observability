const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');
const { NodeSDK } = require('@opentelemetry/sdk-node');
const {
	getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
	ConsoleMetricExporter,
	PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');

//Instrumentations
const { ExpressInstrumentation } =
	require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } =
	require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");

// From Open Telemetry Documentation
const opentelemetry = require('@opentelemetry/sdk-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-proto');
const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-proto');

const sdk = new NodeSDK({
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: "todo-service"
	}),
	traceExporter: new OTLPTraceExporter({
		// optional - default url is http://localhost:4318/v1/traces
		// url: '<your-otlp-endpoint>/v1/traces',
		// optional - collection of custom headers to be sent with each request, empty by default
		headers: {},
	}),
	metricReader: new PeriodicExportingMetricReader({
		exporter: new OTLPMetricExporter({
			// url: '<your-otlp-endpoint>/v1/metrics', // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
			headers: {}, // an optional object containing custom headers to be sent with each request
			concurrencyLimit: 1, // an optional limit on pending requests
		}),
	}),
	instrumentations: [
		getNodeAutoInstrumentations(),
		new ExpressInstrumentation(),
		new MongoDBInstrumentation(),
		new HttpInstrumentation()],
});
sdk.start();
