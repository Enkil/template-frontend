{{#sprites}}
.svg-sprite--{{fileName}} {
    background-image: url("{{{cssPathSvg}}}");
    background-position: {{x}}{{units}} {{y}}{{units}};
    width: {{w}}{{units}};
    height: {{h}}{{units}};
    background-repeat: no-repeat;
    background-size: {{width}}{{units}} {{height}}{{units}};
    {{#cssPathNoSvg}}
    .no-svg & {
        background-image: url("{{{cssPathNoSvg}}}");
    }
    {{/cssPathNoSvg}}
}
{{/sprites}}

