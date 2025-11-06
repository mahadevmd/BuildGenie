package com.buildgenie.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ForwardingController {

    /**
     * Forwards any path that is not an API call and does not have a file extension.
     * This is crucial for allowing React Router to handle client-side routing
     * when a page is refreshed or accessed directly.
     * @return The entry point for the React application.
     */
    @RequestMapping(value = { "/", "/{path:[^\\.]*}" })
    public String forward() {
        return "forward:/index.html";
    }
}